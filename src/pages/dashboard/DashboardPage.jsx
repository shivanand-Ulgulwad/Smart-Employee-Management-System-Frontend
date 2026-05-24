/**
 * DashboardPage – enterprise HRMS dashboard with stats, charts, and recent employees.
 * Uses mock data fallback when API is unavailable.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  MdPeople, MdCorporateFare, MdAttachMoney, MdTrendingUp,
  MdAccessTime, MdStar, MdCalendarToday, MdRefresh
} from 'react-icons/md';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';
import { getAllEmployees } from '../../api/employeeApi';
import { getAllDepartments } from '../../api/departmentApi';
import { SkeletonDashboard } from '../../components/ui/Skeletons';
import DataTable from '../../components/ui/DataTable';

const PIE_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

function StatCard({ icon: Icon, label, value, sub, color = 'blue', trend }) {
  const colors = {
    blue:   'from-blue-500 to-blue-600',
    green:  'from-emerald-500 to-emerald-600',
    amber:  'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
    sky:    'from-sky-500 to-sky-600',
    rose:   'from-rose-500 to-rose-600',
  };
  return (
    <div className="card-hover p-5 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
          <Icon size={22} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`badge text-xs ${trend >= 0 ? 'badge-green' : 'badge-red'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function DashboardPage() {
  const [employees, setEmployees]     = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([getAllEmployees(), getAllDepartments()]);
      setEmployees(empRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (err) {
      toast.error('Failed to fetch dashboard data from backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <SkeletonDashboard />;

  /* Computed stats */
  const totalSalary   = employees.reduce((s, e) => s + (e.salary || 0), 0);
  const avgSalary     = employees.length ? Math.round(totalSalary / employees.length) : 0;
  const topPerformer  = [...employees].sort((a, b) => (b.performanceRating || 0) - (a.performanceRating || 0))[0];
  const highestPaid   = [...employees].sort((a, b) => (b.salary || 0) - (a.salary || 0))[0];

  /* Charts data */
  const deptSalary = departments.map(dept => ({
    name: dept.name,
    avg:  Math.round(employees.filter(e => e.department === dept.name).reduce((s, e, _, arr) => s + e.salary / arr.length, 0)) || 0,
    count: employees.filter(e => e.department === dept.name).length,
  })).filter(d => d.count > 0);

  const deptPie = deptSalary.map(d => ({ name: d.name, value: d.count }));

  const monthlyJoins = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleString('default', { month: 'short' });
    const year  = d.getFullYear();
    const count = employees.filter(e => {
      const jd = new Date(e.joiningDate);
      return jd.getMonth() === d.getMonth() && jd.getFullYear() === year;
    }).length;
    return { month, count };
  });

  const ratingDist = [
    { range: '< 3.0', count: employees.filter(e => e.performanceRating < 3).length },
    { range: '3.0–3.9', count: employees.filter(e => e.performanceRating >= 3 && e.performanceRating < 4).length },
    { range: '4.0–4.4', count: employees.filter(e => e.performanceRating >= 4 && e.performanceRating < 4.5).length },
    { range: '≥ 4.5',   count: employees.filter(e => e.performanceRating >= 4.5).length },
  ];

  const recentEmployees = [...employees].sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate)).slice(0, 5);

  const topPerformers = [...employees]
    .sort((a, b) => (b.performanceRating || 0) - (a.performanceRating || 0))
    .slice(0, 5);

  const recentColumns = [
    { key: 'name',   label: 'Name',       sortable: true, render: (v, row) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-xs text-white font-bold">
          {v.charAt(0)}
        </div>
        <span className="font-medium text-slate-800 dark:text-slate-200">{v}</span>
      </div>
    )},
    { key: 'department', label: 'Dept',       sortable: true, render: v => <span className="badge-blue">{v}</span> },
    { key: 'salary',     label: 'Salary',     sortable: true, render: v => `$${v?.toLocaleString()}` },
    { key: 'performanceRating', label: 'Rating', sortable: true, render: v => (
      <div className="flex items-center gap-1">
        <MdStar className={`text-sm ${v >= 4.5 ? 'text-amber-400' : v >= 4 ? 'text-yellow-400' : 'text-slate-400'}`} />
        <span>{v?.toFixed(1)}</span>
      </div>
    )},
    { key: 'joiningDate', label: 'Joined', render: v => new Date(v).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">HR analytics & workforce overview</p>
        </div>
        <button onClick={fetchData} className="btn-secondary btn-sm">
          <MdRefresh size={16} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={MdPeople}       label="Total Employees"   value={employees.length}           color="blue"   trend={8} />
        <StatCard icon={MdCorporateFare} label="Departments"      value={departments.length}         color="green"  trend={2} />
        <StatCard icon={MdAttachMoney}  label="Avg. Salary"       value={`$${avgSalary.toLocaleString()}`} color="amber" trend={5} />
        <StatCard icon={MdStar}         label="Top Performer"     value={topPerformer?.name?.split(' ')[0] || '—'}
          sub={`Rating: ${topPerformer?.performanceRating?.toFixed(1) || '—'}`}  color="purple" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard icon={MdTrendingUp}   label="Highest Salary"    value={`$${highestPaid?.salary?.toLocaleString() || '—'}`}
          sub={highestPaid?.name} color="sky" />
        <StatCard icon={MdCalendarToday} label="New This Month"   value={employees.filter(e => {
          const d = new Date(e.joiningDate); const n = new Date();
          return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
        }).length}  color="rose" />
        <StatCard icon={MdAccessTime}   label="Total Payroll"      value={`$${totalSalary.toLocaleString()}`} color="green" trend={3} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Avg Salary by Dept */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Avg. Salary by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptSalary} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Avg Salary']} />
              <Bar dataKey="avg" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly joining trend */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Monthly Employee Joinings</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyJoins} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} name="Joinings" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Department distribution pie */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Dept Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={deptPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {deptPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Rating distribution */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Performance Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ratingDist} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Employees" fill="#8b5cf6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Top 5 Performers</h3>
          <span className="badge-green">By Rating</span>
        </div>
        <div className="space-y-3">
          {topPerformers.map((emp, idx) => (
            <div key={emp.id} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                ${idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                {idx + 1}
              </div>
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                {emp.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{emp.name}</p>
                <p className="text-xs text-slate-400">{emp.department}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(emp.performanceRating / 5) * 100}%` }} />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-8 text-right">{emp.performanceRating?.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Employees Table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Recent Employees</h3>
          <a href="/employees" className="text-xs text-primary-600 hover:underline">View all →</a>
        </div>
        <DataTable columns={recentColumns} data={recentEmployees} pageSize={5} emptyTitle="No Employees" emptyDescription="No employees have been added yet." />
      </div>
    </div>
  );
}

export default DashboardPage;

/**
 * ReportsPage – Advanced reports and analytics for the EMS.
 * Visualizing key metrics like department salary distribution,
 * performance trends, and joining reports.
 */
import React, { useState, useEffect } from 'react';
import { 
  MdBarChart, MdPieChart, MdTrendingUp, MdDownload, 
  MdDateRange, MdFilterList, MdAttachMoney 
} from 'react-icons/md';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { CSVLink } from 'react-csv';
import toast from 'react-hot-toast';
import { getAllEmployees } from '../../api/employeeApi';
import { getAllDepartments } from '../../api/departmentApi';
import { SkeletonCard } from '../../components/ui/Skeletons';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function ReportsPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes] = await Promise.all([getAllEmployees(), getAllDepartments()]);
        setEmployees(empRes.data || []);
        setDepartments(deptRes.data || []);
      } catch (err) {
        toast.error('Failed to fetch reports from backend.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );

  // 1. Department Salary Breakdown
  const deptData = departments.length > 0 
    ? departments.map(dept => {
        const deptEmps = employees.filter(e => e.department === dept.name);
        const total = deptEmps.reduce((sum, e) => sum + e.salary, 0);
        return { name: dept.name, totalSalary: total, count: deptEmps.length };
      }).filter(d => d.count > 0)
    : [];

  // 2. Performance Distribution
  const performanceData = [
    { name: '4.5 - 5.0', count: employees.filter(e => e.performanceRating >= 4.5).length },
    { name: '4.0 - 4.4', count: employees.filter(e => e.performanceRating >= 4.0 && e.performanceRating < 4.5).length },
    { name: '3.5 - 3.9', count: employees.filter(e => e.performanceRating >= 3.5 && e.performanceRating < 4.0).length },
    { name: '< 3.5', count: employees.filter(e => e.performanceRating < 3.5).length },
  ];

  // 3. Joining Trends (Monthly)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const joiningTrend = months.map((m, idx) => {
    const count = employees.filter(e => {
      const d = new Date(e.joiningDate);
      return d.getMonth() === idx;
    }).length;
    return { name: m, count };
  });

  const exportData = employees.map(e => ({
    Name: e.name,
    Department: e.department,
    Salary: e.salary,
    Rating: e.performanceRating,
    'Join Date': e.joiningDate
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold">Comprehensive Reports</h1>
          <p className="page-subtitle text-slate-500">Visual data analysis of your workforce</p>
        </div>
        <CSVLink 
          data={exportData} 
          filename="ems_full_report.csv" 
          className="btn-primary flex items-center gap-2"
        >
          <MdDownload /> Export Full Report
        </CSVLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dept Salary Distribution */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center gap-2">
              <MdAttachMoney className="text-primary-600" />
              Salary Distribution by Department
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(v) => [`$${v.toLocaleString()}`, 'Total Salary']}
                />
                <Bar dataKey="totalSalary" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Pie Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center gap-2">
              <MdTrendingUp className="text-emerald-600" />
              Employee Performance Overview
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Joining Trends */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center gap-2">
              <MdDateRange className="text-amber-600" />
              Monthly Joining Trends
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={joiningTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;

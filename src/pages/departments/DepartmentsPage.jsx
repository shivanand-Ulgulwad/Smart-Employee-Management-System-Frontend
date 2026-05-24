/**
 * DepartmentsPage – department cards, employee lists, salary reports, analytics.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  MdAdd, MdEdit, MdDelete, MdPeople, MdAttachMoney,
  MdCorporateFare, MdExpandMore, MdExpandLess
} from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment, getDepartmentEmployees } from '../../api/departmentApi';
import { getAllEmployees } from '../../api/employeeApi';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FormInput from '../../components/ui/FormInput';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeletons';

const DEPT_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316'];

function DeptCard({ dept, employees, color, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const deptEmps = employees.filter(e => e.department === dept.name);
  const avgSalary = deptEmps.length
    ? Math.round(deptEmps.reduce((s, e) => s + e.salary, 0) / deptEmps.length)
    : 0;
  const topPaid = [...deptEmps].sort((a, b) => b.salary - a.salary)[0];

  return (
    <div className="card-hover overflow-hidden">
      {/* Colored top bar */}
      <div className="h-1.5 w-full" style={{ background: color }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
              <MdCorporateFare size={22} style={{ color }} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{dept.name}</h3>
              <p className="text-xs text-slate-400">{dept.description || 'No description'}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => onEdit(dept)} className="btn-icon btn-sm text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20">
              <MdEdit size={15} />
            </button>
            <button onClick={() => onDelete(dept)} className="btn-icon btn-sm text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <MdDelete size={15} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
            <p className="text-lg font-bold text-slate-800 dark:text-white">{deptEmps.length}</p>
            <p className="text-xs text-slate-400">Employees</p>
          </div>
          <div className="text-center bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
            <p className="text-sm font-bold text-slate-800 dark:text-white">${(avgSalary/1000).toFixed(0)}k</p>
            <p className="text-xs text-slate-400">Avg Salary</p>
          </div>
          <div className="text-center bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              {deptEmps.length ? (deptEmps.reduce((s,e) => s + e.performanceRating, 0) / deptEmps.length).toFixed(1) : '—'}
            </p>
            <p className="text-xs text-slate-400">Avg Rating</p>
          </div>
        </div>

        {topPaid && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 px-2">
            <span className="font-medium">Highest Paid:</span> {topPaid.name} — ${topPaid.salary?.toLocaleString()}
          </div>
        )}

        {/* Toggle employees */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 w-full text-xs text-primary-600 hover:text-primary-700 font-medium mt-1"
        >
          {expanded ? <MdExpandLess size={16}/> : <MdExpandMore size={16}/>}
          {expanded ? 'Hide' : 'Show'} employees ({deptEmps.length})
        </button>

        {expanded && (
          <div className="mt-3 space-y-2 animate-fade-in max-h-48 overflow-y-auto pr-1">
            {deptEmps.length === 0
              ? <p className="text-xs text-slate-400 text-center py-3">No employees in this department</p>
              : deptEmps.map(emp => (
                <div key={emp.id} className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0" style={{fontSize:'10px'}}>
                    {emp.name.charAt(0)}
                  </div>
                  <span className="flex-1 truncate text-slate-700 dark:text-slate-300">{emp.name}</span>
                  <span className="text-slate-400">{emp.role}</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">${emp.salary?.toLocaleString()}</span>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees]     = useState([]);
  const [loading, setLoading]         = useState(true);

  const [modalOpen, setModalOpen]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState({ name: '', description: '' });
  const [errors, setErrors]           = useState({});
  const [saving, setSaving]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [deptRes, empRes] = await Promise.all([getAllDepartments(), getAllEmployees()]);
      setDepartments(deptRes.data || []);
      setEmployees(empRes.data || []);
    } catch (err) {
      toast.error('Failed to fetch departments from backend.');
      console.error(err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* Chart data */
  const chartData = departments.map((dept, i) => {
    const emps = employees.filter(e => e.department === dept.name);
    return {
      name: dept.name,
      employees: emps.length,
      avgSalary: emps.length ? Math.round(emps.reduce((s,e) => s+e.salary,0)/emps.length) : 0,
    };
  });

  /* Open add/edit */
  const openAdd = () => { setEditing(null); setForm({name:'',description:''}); setErrors({}); setModalOpen(true); };
  const openEdit = (dept) => { setEditing(dept); setForm({name:dept.name,description:dept.description||''}); setErrors({}); setModalOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateDepartment(editing.id, form);
        setDepartments(prev => prev.map(d => d.id === editing.id ? { ...d, ...form } : d));
        toast.success('Department updated!');
      } else {
        const res = await createDepartment(form);
        setDepartments(prev => [...prev, res.data || { ...form, id: Date.now() }]);
        toast.success('Department created!');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDepartment(deleteTarget.id);
      setDepartments(prev => prev.filter(d => d.id !== deleteTarget.id));
      toast.success('Department deleted.');
    } catch { toast.error('Failed to delete department.'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const totalEmployees = employees.length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">{departments.length} departments · {totalEmployees} employees</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm">
          <MdAdd size={16} /> Add Department
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Departments',    value: departments.length,  color: 'bg-blue-500' },
          { label: 'Total Employees',value: totalEmployees,       color: 'bg-emerald-500' },
          { label: 'Total Payroll',  value: `$${(employees.reduce((s,e)=>s+e.salary,0)/1000).toFixed(0)}k`, color: 'bg-amber-500' },
          { label: 'Avg Dept Size',  value: departments.length ? Math.round(totalEmployees/departments.length) : 0, color: 'bg-purple-500' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={`w-3 h-8 rounded-full ${s.color} flex-shrink-0`} />
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Department Salary Report</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(v, name) => name === 'avgSalary' ? [`$${v.toLocaleString()}`, 'Avg Salary'] : [v, 'Employees']} />
              <Bar yAxisId="left"  dataKey="avgSalary" name="Avg Salary" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar yAxisId="right" dataKey="employees" name="Employees"  fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Department Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : departments.length === 0 ? (
        <div className="card"><EmptyState icon={MdCorporateFare} title="No Departments" description="Create your first department to get started." action={<button onClick={openAdd} className="btn-primary btn-sm"><MdAdd size={16}/> Add Department</button>} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <DeptCard
              key={dept.id}
              dept={dept}
              employees={employees}
              color={DEPT_COLORS[i % DEPT_COLORS.length]}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Department' : 'Add Department'} size="sm"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormInput id="deptName" name="name" label="Department Name" value={form.name}
            onChange={e => setForm(f=>({...f, name:e.target.value}))} error={errors.name} required placeholder="e.g. Engineering" />
          <div className="space-y-1">
            <label className="form-label">Description</label>
            <textarea value={form.description} onChange={e => setForm(f=>({...f, description:e.target.value}))}
              className="form-input resize-none" rows={3} placeholder="Brief description of this department..." />
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Department"
        message={`Delete "${deleteTarget?.name}"? All employee associations may be affected.`}
        confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} danger />
    </div>
  );
}

export default DepartmentsPage;

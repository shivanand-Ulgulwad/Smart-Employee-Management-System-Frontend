/**
 * EmployeesPage – full CRUD with search, filter, sort, pagination, add/edit modal, delete confirmation.
 * Export to CSV via react-csv.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdDownload, MdStar, MdClose } from 'react-icons/md';
import { CSVLink } from 'react-csv';
import toast from 'react-hot-toast';
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../api/employeeApi';
import { getAllDepartments } from '../../api/departmentApi';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FormInput, { FormSelect } from '../../components/ui/FormInput';
import EmptyState from '../../components/ui/EmptyState';
import { MdPeople } from 'react-icons/md';

const EMPTY_FORM = { name: '', email: '', department: '', salary: '', joiningDate: '', role: '', performanceRating: '' };

function validate(f) {
  const e = {};
  if (!f.name.trim())       e.name  = 'Name is required';
  if (!f.email.trim())      e.email = 'Email is required';
  else if (!/^[^@]+@[^@]+\.[^@]+$/.test(f.email)) e.email = 'Invalid email';
  if (!f.department.trim()) e.department = 'Department is required';
  if (!f.salary || isNaN(f.salary) || +f.salary <= 0) e.salary = 'Valid salary required';
  if (!f.joiningDate)       e.joiningDate = 'Joining date required';
  if (!f.role.trim())       e.role  = 'Role is required';
  if (f.performanceRating && (isNaN(f.performanceRating) || +f.performanceRating < 0 || +f.performanceRating > 5)) {
    e.performanceRating = 'Rating must be 0–5';
  }
  return e;
}

function getRatingBadge(r) {
  if (r >= 4.5) return <span className="badge-green flex items-center gap-0.5"><MdStar size={11} />{r?.toFixed(1)}</span>;
  if (r >= 3.5) return <span className="badge-yellow flex items-center gap-0.5"><MdStar size={11} />{r?.toFixed(1)}</span>;
  return <span className="badge-red flex items-center gap-0.5"><MdStar size={11} />{r?.toFixed(1) ?? '—'}</span>;
}

function EmployeesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees]   = useState([]);
  const [departments, setDepts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState(searchParams.get('search') || '');

  /* Sync search state when URL params change (e.g. from Navbar search) */
  useEffect(() => {
    const q = searchParams.get('search') || '';
    if (q) {
      setSearch(q);
      // Clear the URL param so it doesn't stick on subsequent visits
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const [filterDept, setFilterDept] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState(null);   // employee object or null
  const [form, setForm]             = useState(EMPTY_FORM);
  const [errors, setErrors]         = useState({});
  const [saving, setSaving]         = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const [viewEmployee, setViewEmployee] = useState(null);

  /* Fetch */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([getAllEmployees(), getAllDepartments()]);
      setEmployees(empRes.data || []);
      setDepts(deptRes.data || []);
    } catch (err) {
      toast.error('Failed to fetch employees from backend.');
      console.error(err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* Derived: filter + search */
  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchQ = !q || e.name?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q) || e.role?.toLowerCase().includes(q);
    const matchD = !filterDept || e.department === filterDept;
    const matchR = !filterRole || e.role === filterRole;
    return matchQ && matchD && matchR;
  });

  const uniqueRoles = [...new Set(employees.map(e => e.role).filter(Boolean))];

  /* Open add/edit modal */
  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setEditing(emp);
    setForm({ ...emp, salary: emp.salary?.toString(), performanceRating: emp.performanceRating?.toString() });
    setErrors({});
    setModalOpen(true);
  };

  /* Save */
  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const selectedDept = departments.find(d => d.name === form.department);
      const payload = { 
        ...form, 
        salary: +form.salary, 
        performanceRating: +form.performanceRating || 0,
        departmentId: selectedDept ? selectedDept.id : null
      };
      if (editing) {
        await updateEmployee(editing.id, payload);
        setEmployees(prev => prev.map(emp => emp.id === editing.id ? { ...emp, ...payload } : emp));
        toast.success('Employee updated successfully!');
      } else {
        const res = await createEmployee(payload);
        const newEmp = res.data || { ...payload, id: Date.now() };
        setEmployees(prev => [...prev, newEmp]);
        toast.success('Employee added successfully!');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed.');
    } finally { setSaving(false); }
  };

  /* Delete */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEmployee(deleteTarget.id);
      setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id));
      toast.success('Employee deleted.');
    } catch {
      toast.error('Failed to delete employee.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* Table columns */
  const columns = [
    {
      key: 'name', label: 'Employee', sortable: true,
      render: (v, row) => (
        <button onClick={() => setViewEmployee(row)} className="flex items-center gap-2 hover:text-primary-600 text-left">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
            {v.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{v}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </button>
      )
    },
    { key: 'department', label: 'Department', sortable: true, render: v => <span className="badge-blue">{v}</span> },
    { key: 'role',       label: 'Role',       sortable: true },
    { key: 'salary',     label: 'Salary',     sortable: true, render: v => <span className="font-medium">${v?.toLocaleString()}</span> },
    { key: 'joiningDate', label: 'Joined',    sortable: true, render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'performanceRating', label: 'Rating', sortable: true, render: v => getRatingBadge(v) },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(row)} className="btn-icon btn-sm text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20">
            <MdEdit size={16} />
          </button>
          <button onClick={() => setDeleteTarget(row)} className="btn-icon btn-sm text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            <MdDelete size={16} />
          </button>
        </div>
      )
    },
  ];

  /* CSV headers */
  const csvHeaders = [
    { label: 'ID', key: 'id' }, { label: 'Name', key: 'name' }, { label: 'Email', key: 'email' },
    { label: 'Department', key: 'department' }, { label: 'Role', key: 'role' },
    { label: 'Salary', key: 'salary' }, { label: 'Joining Date', key: 'joiningDate' },
    { label: 'Performance Rating', key: 'performanceRating' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{employees.length} total employees</p>
        </div>
        <div className="flex gap-2">
          <CSVLink data={filtered} headers={csvHeaders} filename="employees.csv" className="btn-secondary btn-sm">
            <MdDownload size={16} /> Export CSV
          </CSVLink>
          <button onClick={openAdd} className="btn-primary btn-sm">
            <MdAdd size={16} /> Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
            <MdSearch size={18} className="text-slate-400 flex-shrink-0" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, role..."
              className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
            />
            {search && <button onClick={() => setSearch('')}><MdClose size={16} className="text-slate-400 hover:text-slate-600" /></button>}
          </div>
          <div className="flex items-center gap-2">
            <MdFilterList size={18} className="text-slate-400" />
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="form-select py-2 text-sm w-40">
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="form-select py-2 text-sm w-36">
              <option value="">All Roles</option>
              {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-5">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          pageSize={10}
          emptyTitle="No Employees Found"
          emptyDescription={search || filterDept ? 'Try adjusting your filters.' : 'Start by adding your first employee.'}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Employee' : 'Add New Employee'}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Employee' : 'Add Employee'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput id="name" name="name" label="Full Name" value={form.name}
            onChange={e => setForm(f=>({...f, name: e.target.value}))} error={errors.name} required placeholder="John Doe" />
          <FormInput id="email" name="email" label="Email" type="email" value={form.email}
            onChange={e => setForm(f=>({...f, email: e.target.value}))} error={errors.email} required placeholder="john@company.com" />
          <FormSelect id="department" name="department" label="Department" value={form.department}
            onChange={e => setForm(f=>({...f, department: e.target.value}))} error={errors.department} required>
            <option value="">Select department</option>
            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </FormSelect>
          <FormInput id="role" name="role" label="Role / Job Title" value={form.role}
            onChange={e => setForm(f=>({...f, role: e.target.value}))} error={errors.role} required placeholder="Software Engineer" />
          <FormInput id="salary" name="salary" label="Salary (USD)" type="number" value={form.salary}
            onChange={e => setForm(f=>({...f, salary: e.target.value}))} error={errors.salary} required placeholder="75000" />
          <FormInput id="joiningDate" name="joiningDate" label="Joining Date" type="date" value={form.joiningDate}
            onChange={e => setForm(f=>({...f, joiningDate: e.target.value}))} error={errors.joiningDate} required />
          <FormInput id="performanceRating" name="performanceRating" label="Performance Rating (0–5)" type="number"
            step="0.1" min="0" max="5" value={form.performanceRating}
            onChange={e => setForm(f=>({...f, performanceRating: e.target.value}))} error={errors.performanceRating} placeholder="4.5" />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />

      {/* View Details Modal */}
      <Modal open={!!viewEmployee} onClose={() => setViewEmployee(null)} title="Employee Details" size="md">
        {viewEmployee && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-2xl text-white font-bold">
                {viewEmployee.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{viewEmployee.name}</h3>
                <p className="text-sm text-slate-500">{viewEmployee.role}</p>
                <span className="badge-blue mt-1">{viewEmployee.department}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Email',      value: viewEmployee.email },
                { label: 'Salary',     value: `$${viewEmployee.salary?.toLocaleString()}` },
                { label: 'Joined',     value: new Date(viewEmployee.joiningDate).toLocaleDateString() },
                { label: 'Rating',     value: `${viewEmployee.performanceRating?.toFixed(1)} / 5.0` },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <p className="text-xs text-slate-400 mb-2">Performance</p>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${(viewEmployee.performanceRating / 5) * 100}%` }} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default EmployeesPage;

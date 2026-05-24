/**
 * SalaryPage – payslip generation, bonus/tax/increment calculator, PDF download.
 */
import React, { useState, useEffect, useRef } from 'react';
import { MdSearch, MdDownload, MdAttachMoney, MdTrendingUp, MdReceipt, MdPrint } from 'react-icons/md';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { getAllEmployees } from '../../api/employeeApi';
import EmptyState from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Skeletons';

/* ── Salary calculation logic ── */
function calcIncrementPct(rating) {
  if (rating >= 4.5) return 20;
  if (rating >= 3.5) return 10;
  return 5;
}

function calcBreakdown(employee) {
  const annual    = employee.salary;
  const monthly   = annual / 12;
  const taxRate   = annual > 80000 ? 0.30 : annual > 50000 ? 0.22 : 0.15;
  const tax       = monthly * taxRate;
  const bonus     = monthly * 0.10; // 10% of monthly
  const pf        = monthly * 0.12; // Provident fund
  const net       = monthly - tax - pf + bonus;
  const incrPct   = calcIncrementPct(employee.performanceRating);
  const incrAmt   = annual * (incrPct / 100);

  return { monthly, annual, tax, bonus, pf, net, taxRate: taxRate * 100, incrPct, incrAmt };
}

function PayslipCard({ employee, breakdown, month }) {
  return (
    <div id="payslip-area" className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold">PAYSLIP</h2>
            <p className="text-primary-200 text-sm">Smart Employee Management System</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{month}</p>
            <p className="text-primary-200 text-xs">Period: Monthly</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
            {employee.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-lg">{employee.name}</p>
            <p className="text-primary-200 text-sm">{employee.role} · {employee.department}</p>
            <p className="text-primary-200 text-xs">{employee.email}</p>
          </div>
        </div>
      </div>

      {/* Earnings & Deductions */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Earnings */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Earnings</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Basic Salary</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">${(breakdown.monthly * 0.7).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">HRA Allowance</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">${(breakdown.monthly * 0.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Performance Bonus</span>
                <span className="font-medium text-emerald-600">${breakdown.bonus.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-sm font-semibold">
                <span>Total Earnings</span>
                <span className="text-emerald-600">${(breakdown.monthly + breakdown.bonus).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Deductions</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Income Tax ({breakdown.taxRate.toFixed(0)}%)</span>
                <span className="font-medium text-red-500">-${breakdown.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Provident Fund (12%)</span>
                <span className="font-medium text-red-500">-${breakdown.pf.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-sm font-semibold">
                <span>Total Deductions</span>
                <span className="text-red-500">-${(breakdown.tax + breakdown.pf).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Net Pay</p>
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">${breakdown.net.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">Performance Rating</p>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{employee.performanceRating?.toFixed(1)} ★</p>
          </div>
        </div>

        {/* Increment */}
        <div className="mt-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <MdTrendingUp className="text-amber-600" size={18} />
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Salary Increment</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Based on rating {employee.performanceRating?.toFixed(1)}</p>
              <p className="text-xs text-slate-500">
                {employee.performanceRating >= 4.5 ? 'Excellent — 20% increment' :
                 employee.performanceRating >= 3.5 ? 'Good — 10% increment' : 'Standard — 5% increment'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-amber-700 dark:text-amber-400">+{breakdown.incrPct}%</p>
              <p className="text-sm text-amber-600 dark:text-amber-500">+${breakdown.incrAmt.toLocaleString()}/yr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SalaryPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(null);
  const [month, setMonth]         = useState(() => new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllEmployees();
        setEmployees(res.data || []);
      } catch (err) {
        toast.error('Failed to fetch personnel for salary processing.');
        console.error(err);
      }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = employees.filter(e =>
    !search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.department?.toLowerCase().includes(search.toLowerCase())
  );

  const breakdown = selected ? calcBreakdown(selected) : null;

  /* Download as PDF */
  const downloadPDF = () => {
    if (!selected || !breakdown) return;
    setDownloading(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(30, 78, 138);
      doc.text('PAYSLIP — Smart EMS', 20, 20);
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text(`Employee: ${selected.name}`, 20, 35);
      doc.text(`Department: ${selected.department}`, 20, 44);
      doc.text(`Role: ${selected.role}`, 20, 53);
      doc.text(`Period: ${month}`, 20, 62);
      doc.line(20, 68, 190, 68);
      doc.setFontSize(11);
      doc.text('EARNINGS', 20, 78);
      doc.text(`Basic Salary:          $${(breakdown.monthly * 0.7).toFixed(2)}`, 20, 87);
      doc.text(`HRA Allowance:         $${(breakdown.monthly * 0.2).toFixed(2)}`, 20, 95);
      doc.text(`Performance Bonus:     $${breakdown.bonus.toFixed(2)}`, 20, 103);
      doc.text('DEDUCTIONS', 20, 115);
      doc.text(`Income Tax (${breakdown.taxRate.toFixed(0)}%):      -$${breakdown.tax.toFixed(2)}`, 20, 124);
      doc.text(`Provident Fund (12%):  -$${breakdown.pf.toFixed(2)}`, 20, 132);
      doc.line(20, 140, 190, 140);
      doc.setFontSize(13);
      doc.setTextColor(16, 185, 129);
      doc.text(`NET PAY: $${breakdown.net.toFixed(2)}`, 20, 152);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Salary Increment: ${breakdown.incrPct}% (+$${breakdown.incrAmt.toLocaleString()}/year)`, 20, 162);
      doc.text(`Performance Rating: ${selected.performanceRating?.toFixed(1)} / 5.0`, 20, 170);
      doc.save(`payslip-${selected.name.replace(' ','_')}-${month}.pdf`);
      toast.success('Payslip downloaded!');
    } catch { toast.error('Failed to generate PDF.'); }
    finally { setDownloading(false); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="page-title">Salary Processing</h1>
        <p className="page-subtitle">Generate payslips, view breakdown, apply increments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Employee Selector */}
        <div className="card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Select Employee</h3>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
            <MdSearch size={16} className="text-slate-400 flex-shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search..." className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none" />
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-4">No employees found</p>
            ) : filtered.map(emp => (
              <button
                key={emp.id}
                onClick={() => setSelected(emp)}
                className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-all ${
                  selected?.id === emp.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{emp.name}</p>
                  <p className="text-xs text-slate-400">{emp.department}</p>
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">${(emp.salary/1000).toFixed(0)}k</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payslip */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="card h-full flex items-center justify-center">
              <EmptyState icon={MdReceipt} title="Select an Employee" description="Choose an employee from the left panel to generate their payslip." />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Pay Month:</label>
                  <input type="month" className="form-input py-1 text-sm w-40"
                    defaultValue={new Date().toISOString().slice(0,7)}
                    onChange={e => {
                      const d = new Date(e.target.value + '-01');
                      setMonth(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
                    }}
                  />
                </div>
                <button onClick={downloadPDF} disabled={downloading} className="btn-primary btn-sm">
                  {downloading ? <Spinner size="sm" className="border-white/30 border-t-white" /> : <MdDownload size={16} />}
                  Download PDF
                </button>
              </div>

              <PayslipCard employee={selected} breakdown={breakdown} month={month} />
            </div>
          )}
        </div>
      </div>

      {/* Summary Table */}
      {employees.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Salary Overview — All Employees</h3>
          <div className="table-container">
            <table className="table">
              <thead><tr>
                <th>Employee</th><th>Department</th><th>Annual Salary</th>
                <th>Monthly Net</th><th>Rating</th><th>Increment</th>
              </tr></thead>
              <tbody>
                {employees.map(emp => {
                  const bd = calcBreakdown(emp);
                  return (
                    <tr key={emp.id} onClick={() => setSelected(emp)} className="cursor-pointer">
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-xs text-white font-bold">{emp.name.charAt(0)}</div>
                          <span className="font-medium text-sm">{emp.name}</span>
                        </div>
                      </td>
                      <td><span className="badge-blue">{emp.department}</span></td>
                      <td className="font-medium">${emp.salary?.toLocaleString()}</td>
                      <td className="text-emerald-600 font-medium">${bd.net.toFixed(0)}</td>
                      <td><span className={`badge ${emp.performanceRating >= 4.5 ? 'badge-green' : emp.performanceRating >= 3.5 ? 'badge-yellow' : 'badge-red'}`}>{emp.performanceRating?.toFixed(1)}</span></td>
                      <td><span className="badge-purple">+{bd.incrPct}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalaryPage;

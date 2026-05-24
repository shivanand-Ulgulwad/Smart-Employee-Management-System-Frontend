/**
 * LoginPage – admin login with JWT auth, attempt locking, and show/hide password.
 */
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdPeople } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import FormInput from '../../components/ui/FormInput';

function validate(username, password) {
  const errors = {};
  if (!username.trim()) errors.username = 'Username is required';
  if (!password)        errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
}

function LoginPage() {
  const { login, isLocked, failedAttempts, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm]         = useState({ username: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form.username, form.password);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const result = await login(form.username, form.password);
    if (result.success) {
      toast.success('Welcome back! Login successful.');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message);
      if (result.attemptsLeft !== undefined && result.attemptsLeft > 0) {
        toast(`${result.attemptsLeft} attempt${result.attemptsLeft !== 1 ? 's' : ''} remaining.`, { icon: '⚠️' });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary-900 via-slate-900 to-slate-900 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-800/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <MdPeople className="text-white text-xl" />
          </div>
          <span className="text-white font-bold text-lg">Smart EMS</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Manage your workforce<br />
            <span className="text-primary-400">intelligently.</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            A modern HRMS solution for tracking employees, departments, salaries, and performance — all in one place.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: 'Employees Managed', value: '500+' },
              { label: 'Departments', value: '20+' },
              { label: 'Reports Generated', value: '1K+' },
              { label: 'Uptime', value: '99.9%' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4">
                <p className="text-2xl font-bold text-primary-400">{stat.value}</p>
                <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs relative z-10">© 2025 Smart EMS. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo (mobile only) */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <MdPeople className="text-white text-lg" />
            </div>
            <span className="text-white font-bold text-lg">Smart EMS</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-slate-400 text-sm">Sign in to your admin account</p>
          </div>

          {isLocked && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-sm text-red-300 flex items-start gap-2">
              <span className="text-lg">🔒</span>
              <span>Account locked after {failedAttempts} failed attempts. Please contact your administrator or try again later.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormInput
              id="username"
              name="username"
              label="Username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              error={errors.username}
              required
              disabled={isLocked || loading}
              rightIcon={<MdEmail size={16} />}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary-500"
            />

            <FormInput
              id="password"
              name="password"
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
              disabled={isLocked || loading}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-primary-500"
              rightIcon={
                <button type="button" onClick={() => setShowPass(s => !s)} className="pointer-events-auto cursor-pointer">
                  {showPass ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                </button>
              }
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLocked || loading}
              className="btn-primary w-full btn-lg mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <MdLock size={16} /> Sign In
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500 text-center">
            Default: admin / Admin@123
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

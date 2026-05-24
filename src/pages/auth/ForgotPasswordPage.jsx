/**
 * ForgotPasswordPage – password recovery using security questions.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdLock, MdPeople } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import FormInput from '../../components/ui/FormInput';
import { FormSelect } from '../../components/ui/FormInput';

const SECURITY_QUESTIONS = [
  'What is your mother\'s maiden name?',
  'What was the name of your first pet?',
  'What was the name of your elementary school?',
  'What city were you born in?',
  'What is your favorite movie?',
];

function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=identity, 2=success
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    securityQuestion: SECURITY_QUESTIONS[0],
    answer: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  function validate() {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.answer.trim())   errs.answer   = 'Answer is required';
    if (!form.newPassword)     errs.newPassword = 'New password is required';
    else if (form.newPassword.length < 8) errs.newPassword = 'Minimum 8 characters required';
    else if (!/[A-Z]/.test(form.newPassword)) errs.newPassword = 'Must contain uppercase letter';
    else if (!/[0-9]/.test(form.newPassword)) errs.newPassword = 'Must contain a number';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const result = await forgotPassword({
      username:         form.username,
      securityQuestion: form.securityQuestion,
      answer:           form.answer,
      newPassword:      form.newPassword,
    });
    setLoading(false);

    if (result.success) {
      toast.success('Password reset successful!');
      setStep(2);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <MdPeople className="text-white text-lg" />
          </div>
          <span className="text-white font-bold text-lg">Smart EMS</span>
        </div>

        <div className="card dark:bg-slate-800 border-slate-700 p-8">
          {step === 1 ? (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdLock size={28} className="text-primary-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Reset Password</h2>
                <p className="text-slate-400 text-sm">Answer your security question to reset your password.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <FormInput
                  id="username"
                  name="username"
                  label="Username"
                  placeholder="Your username"
                  value={form.username}
                  onChange={handleChange}
                  error={errors.username}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />

                <FormSelect
                  id="securityQuestion"
                  name="securityQuestion"
                  label="Security Question"
                  value={form.securityQuestion}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                >
                  {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </FormSelect>

                <FormInput
                  id="answer"
                  name="answer"
                  label="Your Answer"
                  placeholder="Your answer"
                  value={form.answer}
                  onChange={handleChange}
                  error={errors.answer}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />

                <FormInput
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  type="password"
                  placeholder="Min 8 chars, uppercase, number"
                  value={form.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />

                <FormInput
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
              <p className="text-slate-400 text-sm mb-6">Your password has been successfully reset. You can now login with your new password.</p>
              <button onClick={() => navigate('/login')} className="btn-primary w-full">Back to Login</button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary-400 transition-colors">
              <MdArrowBack size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

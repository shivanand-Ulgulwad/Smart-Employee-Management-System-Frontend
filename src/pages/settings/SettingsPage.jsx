/**
 * SettingsPage – Manage admin profile, security, and application preferences.
 */
import React, { useState } from 'react';
import { MdSettings, MdPerson, MdSecurity, MdPalette, MdNotifications, MdSave } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import FormInput from '../../components/ui/FormInput';
import toast from 'react-hot-toast';

function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || 'admin@example.com',
    phone: '+1 234 567 890'
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success('Profile settings updated successfully');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed successfully');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title text-2xl font-bold">Account Settings</h1>
        <p className="page-subtitle text-slate-500">Manage your profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar (Local) */}
        <div className="md:col-span-1 space-y-2">
          <a href="#profile" className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 text-primary-700 font-medium border border-primary-100">
            <MdPerson /> Profile Info
          </a>
          <a href="#security" className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
            <MdSecurity /> Security
          </a>
          <a href="#appearance" className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
            <MdPalette /> Appearance
          </a>
          <a href="#notifications" className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
            <MdNotifications /> Notifications
          </a>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Section */}
          <section id="profile" className="card p-6 scroll-mt-24">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-700">
              <MdPerson className="text-primary-600" /> Public Profile
            </h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-4xl text-slate-400 font-bold overflow-hidden">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <button type="button" className="btn-outline text-xs">Change Avatar</button>
              </div>
              <FormInput 
                label="Display Name" 
                value={profileForm.name} 
                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
              />
              <FormInput 
                label="Email Address" 
                type="email"
                value={profileForm.email} 
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
              />
              <FormInput 
                label="Phone Number" 
                value={profileForm.phone} 
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
              />
              <div className="pt-4">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <MdSave /> Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* Security Section */}
          <section id="security" className="card p-6 scroll-mt-24">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-700">
              <MdSecurity className="text-red-500" /> Change Password
            </h3>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <FormInput 
                label="Current Password" 
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
              />
              <FormInput 
                label="New Password" 
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
              />
              <FormInput 
                label="Confirm New Password" 
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
              />
              <div className="pt-4">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <MdSave /> Update Password
                </button>
              </div>
            </form>
          </section>

          {/* Appearance Section */}
          <section id="appearance" className="card p-6 scroll-mt-24">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-700">
              <MdPalette className="text-amber-500" /> Interface Customization
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-slate-500">Toggle dark theme for the application</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

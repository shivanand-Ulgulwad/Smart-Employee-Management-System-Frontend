/**
 * Navbar – top navigation bar with menu toggle, search, theme, notifications, and profile.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdMenu, MdSearch, MdNotifications, MdDarkMode, MdLightMode, MdPerson, MdSettings, MdLogout } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ConfirmDialog from '../ui/ConfirmDialog';

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogout, setShowLogout]   = useState(false);
  const [search, setSearch]           = useState('');
  const profileRef = useRef(null);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    function handler(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center gap-3 h-16 px-4 sm:px-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        {/* Menu toggle */}
        <button onClick={onMenuClick} className="btn-icon text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
          <MdMenu size={22} />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
          <button
            onClick={() => { if (search.trim()) { navigate(`/employees?search=${encodeURIComponent(search.trim())}`); setSearch(''); } }}
            className="text-slate-400 hover:text-primary-600 flex-shrink-0 transition-colors"
            title="Search"
          >
            <MdSearch size={18} />
          </button>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && search.trim()) {
                navigate(`/employees?search=${encodeURIComponent(search.trim())}`);
                setSearch('');
              }
            }}
            placeholder="Search employees, departments..."
            className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="btn-icon text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" title="Toggle theme">
            {isDark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>

          {/* Notifications */}
          <button className="btn-icon relative text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <MdNotifications size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(o => !o)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'Admin'}</p>
                <p className="text-xs text-slate-400">{user?.role || 'ADMIN'}</p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-slate-200 dark:border-slate-700 py-1 animate-fade-in z-50">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400">{user?.username}</p>
                </div>
                <button onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <MdSettings size={16} /> Settings
                </button>
                <button onClick={() => { setShowLogout(true); setProfileOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <MdLogout size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={showLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
        danger
      />
    </>
  );
}

export default Navbar;

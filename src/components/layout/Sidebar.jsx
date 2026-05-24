/**
 * Sidebar – collapsible navigation sidebar with icon+label links.
 * On mobile it acts as a drawer (controlled externally).
 */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdPeople, MdCorporateFare, MdAttachMoney,
  MdBarChart, MdHistory, MdSettings, MdLogout, MdClose
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useState } from 'react';

const NAV_ITEMS = [
  { path: '/dashboard',   label: 'Dashboard',   icon: MdDashboard },
  { path: '/employees',   label: 'Employees',   icon: MdPeople },
  { path: '/departments', label: 'Departments', icon: MdCorporateFare },
  { path: '/salary',      label: 'Salary',      icon: MdAttachMoney },
  { path: '/reports',     label: 'Reports',     icon: MdBarChart },
  { path: '/logs',        label: 'Logs',        icon: MdHistory },
  { path: '/settings',    label: 'Settings',    icon: MdSettings },
];

function Sidebar({ collapsed, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarClass = [
    'fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300',
    /* Desktop width */
    collapsed ? 'lg:w-16' : 'lg:w-64',
    /* Mobile: show/hide as drawer */
    mobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0',
  ].join(' ');

  return (
    <>
      <aside className={sidebarClass}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800 flex-shrink-0">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <MdPeople className="text-white text-lg" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight">Smart EMS</p>
              <p className="text-slate-400 text-xs">HR Management</p>
            </div>
          )}
          {/* Mobile close */}
          <button onClick={onMobileClose} className="ml-auto lg:hidden text-slate-400 hover:text-white">
            <MdClose size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => onMobileClose?.()}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-900/60 text-primary-300 border border-primary-800/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800',
                ].join(' ')
              }
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-slate-800 p-3 flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-xs font-medium truncate">{user?.name || 'Admin'}</p>
                <p className="text-slate-400 text-xs truncate">{user?.role || 'ADMIN'}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-150"
          >
            <MdLogout size={20} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

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

export default Sidebar;

/**
 * MainLayout – wraps all protected pages.
 * Includes: Sidebar + Navbar + page content area with breadcrumb.
 */
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

/* Build breadcrumb from pathname */
function getBreadcrumbs(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'App', path: '/' }];
  let cumulativePath = '';
  for (const part of parts) {
    cumulativePath += `/${part}`;
    crumbs.push({
      label: part.charAt(0).toUpperCase() + part.slice(1),
      path: cumulativePath,
    });
  }
  return crumbs;
}

function MainLayout() {
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [mobileSidebarOpen, setMobileOpen]  = useState(false);
  const location = useLocation();

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={!sidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Navbar
          onMenuClick={() => { setMobileOpen(true); setSidebarOpen(o => !o); }}
          sidebarOpen={sidebarOpen}
        />

        {/* Breadcrumb */}
        <div className="px-4 sm:px-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <nav className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.path}>
                {idx > 0 && <span className="mx-1">/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'text-primary-600 dark:text-primary-400 font-medium' : ''}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;

/**
 * App Router configuration with all application routes.
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import PageLoader from '../components/ui/PageLoader';
import ErrorBoundary from '../components/ErrorBoundary';

/* Lazy-loaded pages */
const LoginPage          = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const DashboardPage      = lazy(() => import('../pages/dashboard/DashboardPage'));
const EmployeesPage      = lazy(() => import('../pages/employees/EmployeesPage'));
const DepartmentsPage    = lazy(() => import('../pages/departments/DepartmentsPage'));
const SalaryPage         = lazy(() => import('../pages/salary/SalaryPage'));
const ReportsPage        = lazy(() => import('../pages/reports/ReportsPage'));
const LogsPage           = lazy(() => import('../pages/logs/LogsPage'));
const SettingsPage       = lazy(() => import('../pages/settings/SettingsPage'));
const UnauthorizedPage   = lazy(() => import('../pages/UnauthorizedPage'));
const NotFoundPage       = lazy(() => import('../pages/NotFoundPage'));

function AppRouter() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { fontFamily: 'Inter, sans-serif', fontSize: '14px', borderRadius: '10px', padding: '12px 16px' },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public */}
                <Route path="/login"            element={<LoginPage />} />
                <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
                <Route path="/unauthorized"     element={<UnauthorizedPage />} />

                {/* Protected (ADMIN) */}
                <Route element={<ProtectedRoute roles={['ADMIN']}><MainLayout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard"    element={<DashboardPage />} />
                  <Route path="/employees"    element={<EmployeesPage />} />
                  <Route path="/departments"  element={<DepartmentsPage />} />
                  <Route path="/salary"       element={<SalaryPage />} />
                  <Route path="/reports"      element={<ReportsPage />} />
                  <Route path="/logs"         element={<LogsPage />} />
                  <Route path="/settings"     element={<SettingsPage />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default AppRouter;

/**
 * UnauthorizedPage – displayed when a user tries to access a restricted route.
 */
import React from 'react';
import { MdLockPerson, MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 text-center">
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 text-red-500 animate-pulse">
        <MdLockPerson size={48} />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="btn-secondary flex items-center gap-2"
        >
          <MdArrowBack /> Go Back
        </button>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn-primary"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}

export default UnauthorizedPage;

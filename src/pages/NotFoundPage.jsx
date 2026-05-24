/**
 * NotFoundPage – 404 error page.
 */
import React from 'react';
import { MdOutline探索, MdHome } from 'react-icons/md'; // Note: MdOutlineExploring or similar
import { MdErrorOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 text-center">
      <div className="relative mb-8">
        <h1 className="text-[120px] font-black text-slate-200 dark:text-slate-800 leading-none select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <MdErrorOutline size={64} className="text-primary-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Oops! Page not found</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button 
        onClick={() => navigate('/dashboard')} 
        className="btn-primary flex items-center gap-2"
      >
        <MdHome /> Return Dashboard
      </button>
    </div>
  );
}

export default NotFoundPage;

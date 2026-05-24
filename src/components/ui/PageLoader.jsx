/**
 * PageLoader – full page loading spinner shown during lazy route loading.
 */
import React from 'react';
import { MdPeople } from 'react-icons/md';

function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900 z-50">
      <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4 animate-pulse">
        <MdPeople className="text-white text-2xl" />
      </div>
      <div className="w-48 h-1 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-primary-500 rounded-full animate-shimmer bg-[length:300%_100%]
          bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600" />
      </div>
      <p className="text-slate-400 text-sm mt-4">Loading Smart EMS...</p>
    </div>
  );
}

export default PageLoader;

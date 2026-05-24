/**
 * EmptyState – displayed when no data is available.
 */
import React from 'react';
import { MdSearchOff } from 'react-icons/md';

function EmptyState({ icon: Icon = MdSearchOff, title = 'No Data Found', description = 'There is nothing to display here yet.', action }) {
  return (
    <div className="empty-state">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <Icon size={40} className="text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;

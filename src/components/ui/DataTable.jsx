/**
 * DataTable – generic sortable, paginated table.
 * Props: columns, data, loading, emptyMessage, actions
 */
import React, { useState } from 'react';
import { MdArrowUpward, MdArrowDownward, MdUnfoldMore } from 'react-icons/md';
import { SkeletonTable } from './Skeletons';
import EmptyState from './EmptyState';

function DataTable({ columns = [], data = [], loading = false, emptyTitle, emptyDescription, pageSize = 10 }) {
  const [sortKey, setSortKey]   = useState(null);
  const [sortDir, setSortDir]   = useState('asc');
  const [page, setPage]         = useState(1);

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const va = a[sortKey]; const vb = b[sortKey];
    if (va === vb) return 0;
    const cmp = va > vb ? 1 : -1;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <SkeletonTable rows={pageSize} cols={columns.length} />;

  return (
    <div className="space-y-3">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className={col.sortable ? 'cursor-pointer select-none' : ''} onClick={() => col.sortable && handleSort(col.key)}>
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortKey === col.key
                          ? sortDir === 'asc' ? <MdArrowUpward size={14} /> : <MdArrowDownward size={14} />
                          : <MdUnfoldMore size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length}>
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </td></tr>
            ) : (
              paged.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map(col => (
                    <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-1">
            <button onClick={() => setPage(1)}        disabled={page === 1}          className="btn-secondary btn-sm px-2">«</button>
            <button onClick={() => setPage(p => p-1)} disabled={page === 1}          className="btn-secondary btn-sm">‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={p === page ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => p+1)} disabled={page === totalPages} className="btn-secondary btn-sm">›</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="btn-secondary btn-sm px-2">»</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;

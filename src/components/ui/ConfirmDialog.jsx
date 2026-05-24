/**
 * ConfirmDialog – reusable confirmation modal before destructive actions.
 */
import React from 'react';
import { MdWarning, MdInfo } from 'react-icons/md';
import Modal from './Modal';

function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, danger = false, loading = false }) {
  return (
    <Modal open={open} onClose={onCancel} size="sm"
      footer={
        <>
          <button onClick={onCancel} disabled={loading} className="btn-secondary">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={danger ? 'btn-danger' : 'btn-primary'}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
          {danger
            ? <MdWarning size={28} className="text-red-600 dark:text-red-400" />
            : <MdInfo   size={28} className="text-blue-600 dark:text-blue-400" />}
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;

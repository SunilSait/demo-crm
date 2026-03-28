import React from 'react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, agentName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2>Delete Agent</h2>
        <p>Are you sure you want to delete <strong>{agentName}</strong>? This action cannot be undone.</p>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

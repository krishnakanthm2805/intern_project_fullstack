import React, { useEffect } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, user, isLoading = false }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: '#fb7185' }}>
            <AlertTriangle size={20} />
            <span>Confirm Deletion</span>
          </div>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            disabled={isLoading}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Are you sure you want to permanently delete user{' '}
            <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong> (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{user.email}</span>)?
          </p>
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: '#fda4af',
            }}
          >
            This action cannot be undone. The record will be removed from the database.
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete User</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

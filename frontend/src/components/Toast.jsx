import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-item">
          <div style={{ color: '#fbbf24', flexShrink: 0 }}>
            {toast.type === 'tip' ? <Sparkles size={20} /> : <CheckCircle2 size={20} />}
          </div>

          <div style={{ flex: 1, fontSize: '0.88rem', lineHeight: 1.4 }}>
            {toast.message}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            style={{ color: '#9ca3af', display: 'flex', alignItems: 'center' }}
            aria-label="Dismiss toast"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

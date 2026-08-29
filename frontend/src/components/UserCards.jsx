import React, { useState } from 'react';
import { Edit3, Trash2, Mail, Copy, Check } from 'lucide-react';
import { getAvatarBackground, getInitials } from '../utils/avatar';

export function UserCards({ users, onEdit, onDelete, onCopyEmail }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (user) => {
    navigator.clipboard.writeText(user.email);
    setCopiedId(user.id);
    if (onCopyEmail) onCopyEmail(user.email);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="cards-grid">
      {users.map((user) => (
        <div key={user.id} className="user-card">
          <div className="card-header">
            <span className="id-pill">ID #{user.id}</span>
            <div className="action-buttons">
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => onEdit(user)}
                title="Edit user"
                style={{ width: '30px', height: '30px' }}
              >
                <Edit3 size={13} />
              </button>
              <button
                className="btn btn-danger btn-icon"
                onClick={() => onDelete(user)}
                title="Delete user"
                style={{ width: '30px', height: '30px' }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div className="card-body">
            <div
              className="user-avatar"
              style={{
                width: '44px',
                height: '44px',
                fontSize: '1rem',
                background: getAvatarBackground(user.name || user.email),
              }}
            >
              {getInitials(user.name)}
            </div>
            <div>
              <div className="user-name" style={{ fontSize: '1rem' }}>
                {user.name}
              </div>
              <div
                className="email-cell"
                style={{ marginTop: '0.2rem', fontSize: '0.82rem' }}
              >
                <Mail size={13} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
                <span>{user.email}</span>
                <button
                  className="copy-btn"
                  style={{ opacity: 1 }}
                  onClick={() => handleCopy(user)}
                  title="Copy email"
                >
                  {copiedId === user.id ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import React, { useState } from 'react';
import { Edit3, Trash2, Mail, Copy, Check } from 'lucide-react';
import { getAvatarBackground, getInitials } from '../utils/avatar';

export function UserTable({ users, onEdit, onDelete, onCopyEmail }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (user) => {
    navigator.clipboard.writeText(user.email);
    setCopiedId(user.id);
    if (onCopyEmail) onCopyEmail(user.email);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>ID</th>
            <th>User</th>
            <th>Email Address</th>
            <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <span className="id-pill">#{user.id}</span>
              </td>
              <td>
                <div className="user-cell">
                  <div
                    className="user-avatar"
                    style={{ background: getAvatarBackground(user.name || user.email) }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div className="user-name">{user.name}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="email-cell">
                  <Mail size={14} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
                  <span>{user.email}</span>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(user)}
                    title="Copy email"
                  >
                    {copiedId === user.id ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                  </button>
                </div>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => onEdit(user)}
                    title="Edit user"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-icon"
                    onClick={() => onDelete(user)}
                    title="Delete user"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

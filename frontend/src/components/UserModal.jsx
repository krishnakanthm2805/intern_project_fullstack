import React, { useState, useEffect, useRef } from 'react';
import { X, User, Mail, Save, Plus } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UserModal({ isOpen, onClose, onSubmit, initialUser = null, isLoading = false }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  const isEdit = Boolean(initialUser?.id);

  useEffect(() => {
    if (isOpen) {
      if (initialUser) {
        setName(initialUser.name || '');
        setEmail(initialUser.email || '');
      } else {
        setName('');
        setEmail('');
      }
      setErrors({});
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [isOpen, initialUser]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: name.trim(), email: email.trim().toLowerCase() });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {isEdit ? <Save size={18} color="var(--primary)" /> : <Plus size={18} color="var(--primary)" />}
            <span>{isEdit ? 'Edit User Profile' : 'Add New User'}</span>
          </div>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            disabled={isLoading}
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="userName">
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="userName"
                  ref={nameInputRef}
                  type="text"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  disabled={isLoading}
                  style={{ width: '100%' }}
                />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="userEmail">
                Email Address
              </label>
              <input
                id="userEmail"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                disabled={isLoading}
                style={{ width: '100%' }}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
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
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  {isEdit ? <Save size={16} /> : <Plus size={16} />}
                  <span>{isEdit ? 'Save Changes' : 'Create User'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

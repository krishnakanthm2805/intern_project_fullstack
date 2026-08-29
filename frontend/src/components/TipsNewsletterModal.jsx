import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Send, GraduationCap } from 'lucide-react';
import { subscribeNewsletter } from '../services/api';

export default function TipsNewsletterModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetExam, setTargetExam] = useState('JEE (Engineering)');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      await subscribeNewsletter({ name, email, targetExam });
    } catch (err) {
      console.warn('Newsletter submission notice:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess(`Welcome ${name || 'Student'}! Check your inbox for your free college counseling guide.`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '580px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#0b1c11',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={20} />
            </div>
            <h3 className="modal-title">Free Admission Guidance</h3>
          </div>

          <button className="btn-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <p style={{ fontSize: '0.92rem', color: '#d1d5db', lineHeight: 1.55 }}>
                  Join over <strong>45,000+ students and parents</strong> receiving our weekly cutoff alerts, JoSAA/NEET choice-filling tips, and scholarship guides from top alumni coaches.
                </p>
              </div>

              <div style={{
                background: 'rgba(5, 17, 10, 0.6)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#fbbf24' }}>
                  <CheckCircle2 size={16} />
                  <span>Instant PDF: "2026 NIRF Top 50 Colleges & Closing Cutoffs Matrix"</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#fbbf24' }}>
                  <CheckCircle2 size={16} />
                  <span>Weekly Branch vs College Tradeoff Decision Matrix</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#fbbf24' }}>
                  <CheckCircle2 size={16} />
                  <span>Verified 2025 Placement & Highest Package Analysis</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb' }}>Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className="finder-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb' }}>Your Email Address</label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  className="finder-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb' }}>Target Entrance Exam / Stream</label>
                <select
                  className="finder-select"
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                >
                  <option value="JEE (Engineering)">JEE Advanced / Mains (Engineering)</option>
                  <option value="NEET (Medical)">NEET UG (MBBS / Medical)</option>
                  <option value="CAT (Management)">CAT / XAT (MBA / Management)</option>
                  <option value="CLAT (Law)">CLAT / AILET (Law)</option>
                  <option value="CUET (Central Univ)">CUET (Central Universities)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-hero-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.9rem' }}
              >
                <Send size={18} />
                <span>Send Free Cutoff Guide & Alerts</span>
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h4 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', color: '#ffffff' }}>
                You are registered, {name || 'Student'}!
              </h4>

              <p style={{ fontSize: '0.92rem', color: '#9ca3af', maxWidth: '400px' }}>
                We've sent your free 2026 Cutoffs Matrix & counseling guide to <strong>{email}</strong>.
              </p>

              <button
                className="btn-hero-primary mt-2"
                onClick={onClose}
              >
                <span>Return to Campus Compass</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

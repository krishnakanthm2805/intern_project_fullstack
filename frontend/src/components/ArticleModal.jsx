import React from 'react';
import { X, Check, XCircle, Star, User, Calendar, GraduationCap, ShieldCheck } from 'lucide-react';

export default function ArticleModal({ item, onClose }) {
  if (!item) return null;

  const isCategoryGuide = !!item.fullContent;
  const isBrand = !!item.scorecard;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '820px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(251, 191, 36, 0.15)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="modal-title">{item.title || item.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                {item.category || item.tag || 'Official Admission Guide'} • Verified by Academic Counselors
              </p>
            </div>
          </div>

          <button className="btn-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Image if available */}
          {item.image && (
            <div style={{
              width: '100%',
              height: '260px',
              borderRadius: '14px',
              overflow: 'hidden',
              background: '#07150c',
            }}>
              <img
                src={item.image}
                alt={item.title || item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80';
                }}
              />
            </div>
          )}

          {/* Author & Meta Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: '#9ca3af' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ffffff' }}>
                <User size={15} color="#fbbf24" />
                <span>{item.author || 'Campus Compass Editorial Team'}</span>
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} />
                <span>{item.date || 'Updated recently'}</span>
              </span>
            </div>

            {item.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', fontWeight: 700 }}>
                <Star size={16} className="fill-current" />
                <span>{item.rating} / 5.0 Rating</span>
              </div>
            )}
          </div>

          {/* Body Content Rendering */}
          {isCategoryGuide ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ fontFamily: 'Outfit', fontSize: '1.35rem', color: '#ffffff' }}>
                {item.fullContent.headline}
              </h4>
              <p style={{ fontSize: '0.95rem', color: '#d1d5db', lineHeight: 1.6 }}>
                {item.fullContent.intro}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                {item.fullContent.sections.map((sec, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(5, 17, 10, 0.6)',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <h5 style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '0.4rem', fontWeight: 700 }}>
                      {sec.title}
                    </h5>
                    <p style={{ fontSize: '0.88rem', color: '#d1d5db', lineHeight: 1.55 }}>
                      {sec.body}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                marginTop: '0.5rem',
              }}>
                <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.25rem' }}>
                  Counselor Takeaway & Advice:
                </strong>
                <p style={{ fontSize: '0.88rem', color: '#f3f4f6' }}>
                  {item.fullContent.recommendation}
                </p>
              </div>
            </div>
          ) : isBrand ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontSize: '1rem', color: '#d1d5db', lineHeight: 1.6 }}>
                {item.summary}
              </p>

              {/* Scorecard */}
              <div style={{
                background: 'rgba(5, 17, 10, 0.7)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <h5 style={{ color: '#fbbf24', fontSize: '0.95rem', marginBottom: '0.85rem', fontWeight: 700 }}>
                  Verified Institution Scorecard
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  {Object.entries(item.scorecard).map(([key, val]) => (
                    <div key={key} style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e', display: 'block' }}>{val}</span>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'capitalize' }}>{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontSize: '1rem', color: '#d1d5db', lineHeight: 1.6 }}>
                {item.excerpt}
              </p>

              {item.pros && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(34, 197, 94, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <h5 style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Check size={16} /> Key Strengths
                    </h5>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: '#d1d5db' }}>
                      {item.pros.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <h5 style={{ color: '#f87171', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <XCircle size={16} /> Considerations
                    </h5>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: '#d1d5db' }}>
                      {item.cons.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {item.verdict && (
                <div style={{
                  background: 'rgba(251, 191, 36, 0.08)',
                  border: '1px solid rgba(251, 191, 36, 0.25)',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                }}>
                  <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.25rem' }}>
                    Alumni Counselor Verdict:
                  </strong>
                  <p style={{ fontSize: '0.88rem', color: '#f3f4f6' }}>
                    {item.verdict}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, MapPin, Star, Compass, Award, Briefcase, GraduationCap, Scale, Check } from 'lucide-react';
import { TOP_COLLEGES } from '../data/collegeData';

export default function CourseModal({
  isOpen,
  onClose,
  initialFilter = {},
  onToggleCompare,
  comparedIds = [],
}) {
  const [searchQuery, setSearchQuery] = useState(initialFilter.query || '');
  const [selectedState, setSelectedState] = useState(initialFilter.state || 'All');
  const [selectedDegree, setSelectedDegree] = useState(initialFilter.degree || 'All');

  if (!isOpen) return null;

  const filteredColleges = TOP_COLLEGES.filter((college) => {
    const matchesQuery = !searchQuery ||
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'All' || college.state === selectedState;
    const matchesDegree = selectedDegree === 'All' || college.degree.includes(selectedDegree);
    return matchesQuery && matchesState && matchesDegree;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '920px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(251, 191, 36, 0.15)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <h3 className="modal-title">National College & University Directory</h3>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Coverage of over 2,000+ top NIRF ranked universities, IITs, IIMs, and medical institutions
              </p>
            </div>
          </div>

          <button className="btn-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quick Filters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            background: 'rgba(5, 17, 10, 0.6)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <input
              type="text"
              placeholder="Search college, city or course..."
              className="finder-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'rgba(10, 28, 17, 0.9)' }}
            />

            <select
              className="finder-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{ background: 'rgba(10, 28, 17, 0.9)' }}
            >
              <option value="All">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Telangana">Telangana</option>
            </select>

            <select
              className="finder-select"
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              style={{ background: 'rgba(10, 28, 17, 0.9)' }}
            >
              <option value="All">All Degrees</option>
              <option value="B.Tech">B.Tech / Engineering</option>
              <option value="MBA">MBA / Management</option>
              <option value="MBBS">MBBS / Medical</option>
            </select>
          </div>

          {/* Results List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredColleges.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9ca3af' }}>
                <Compass size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h4>No institutions found matching your criteria</h4>
                <p style={{ fontSize: '0.85rem' }}>Try clearing filters or adjusting your search term.</p>
              </div>
            ) : (
              filteredColleges.map((college) => {
                const isCompared = comparedIds.includes(college.id);
                return (
                  <div
                    key={college.id}
                    style={{
                      background: 'rgba(14, 38, 24, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '1.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{
                            background: 'rgba(251, 191, 36, 0.15)',
                            color: '#fbbf24',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                          }}>
                            NIRF #{college.nirf_rank}
                          </span>
                          <h4 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', color: '#ffffff', fontWeight: 700 }}>
                            {college.name}
                          </h4>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.82rem', marginTop: '0.35rem' }}>
                          <MapPin size={14} color="#fbbf24" />
                          <span>{college.city}, {college.state}</span>
                          <span>•</span>
                          <span>{college.degree}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontWeight: 700 }}>
                          <Star size={16} className="fill-current" />
                          <span>{college.rating}</span>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({college.review_count})</span>
                        </div>
                        <span style={{
                          background: 'rgba(34, 197, 94, 0.15)',
                          color: '#22c55e',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                        }}>
                          {college.annual_fees}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#d1d5db', lineHeight: 1.55 }}>
                      {college.overview}
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '0.75rem',
                    }}>
                      <div style={{
                        background: 'rgba(5, 17, 10, 0.5)',
                        padding: '0.6rem 0.9rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: '#9ca3af',
                      }}>
                        <strong style={{ color: '#fbbf24' }}>Placements: </strong>
                        Avg {college.avg_ctc} (Peak {college.highest_ctc})
                      </div>

                      <div style={{
                        background: 'rgba(5, 17, 10, 0.5)',
                        padding: '0.6rem 0.9rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: '#9ca3af',
                      }}>
                        <strong style={{ color: '#fbbf24' }}>Cutoff: </strong>
                        {college.cutoffInfo}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {college.features.map((feat, i) => (
                          <span
                            key={i}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              fontSize: '0.72rem',
                              color: '#9ca3af',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '9999px',
                            }}
                          >
                            {feat}
                          </span>
                        ))}
                      </div>

                      {onToggleCompare && (
                        <button
                          style={{
                            background: isCompared ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                            color: isCompared ? '#22c55e' : '#ffffff',
                            border: `1px solid ${isCompared ? '#22c55e' : 'rgba(255, 255, 255, 0.15)'}`,
                            padding: '0.4rem 0.85rem',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                          onClick={() => onToggleCompare(college)}
                        >
                          {isCompared ? <Check size={14} /> : <Scale size={14} />}
                          <span>{isCompared ? 'Added to Compare' : 'Compare'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

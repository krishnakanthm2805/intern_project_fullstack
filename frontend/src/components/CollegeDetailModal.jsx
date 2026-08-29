import React, { useState } from 'react';
import {
  X,
  MapPin,
  Star,
  IndianRupee,
  TrendingUp,
  Award,
  Building,
  Calendar,
  Layers,
  GraduationCap,
  Briefcase,
  MessageSquare,
  CheckCircle,
  Users,
} from 'lucide-react';

export default function CollegeDetailModal({ college, onClose, onToggleCompare, isCompared }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!college) return null;

  const formatFee = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
    return `₹${amount.toLocaleString()}`;
  };

  const bannerFallback = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80';
  const logoFallback = 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&auto=format&fit=crop&q=80';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header Banner */}
        <div className="detail-modal-hero">
          <img
            src={college.banner_url || college.image || bannerFallback}
            alt={college.name}
            className="detail-hero-img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = bannerFallback;
            }}
          />
          <div className="detail-hero-overlay"></div>

          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>

          <div className="detail-hero-content">
            <div className="detail-logo-group">
              <img
                src={college.logo_url || college.image || logoFallback}
                alt=""
                className="detail-logo"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = logoFallback;
                }}
              />
              <div>
                <div className="detail-badges-row">
                  {college.nirf_rank && (
                    <span className="badge-pill nirf-pill">
                      <Award size={13} />
                      NIRF #{college.nirf_rank}
                    </span>
                  )}
                  <span className="badge-pill type-pill">{college.institute_type}</span>
                  <span className="badge-pill acc-pill">{college.accreditation}</span>
                </div>
                <h2 className="detail-title">{college.name}</h2>
                <div className="detail-meta-row">
                  <span className="meta-item">
                    <MapPin size={15} />
                    {college.city}, {college.state}
                  </span>
                  <span className="meta-item">
                    <Calendar size={15} />
                    Estd. {college.established_year}
                  </span>
                  <span className="meta-item">
                    <Building size={15} />
                    {college.campus_size} Campus
                  </span>
                  <span className="meta-item rating-meta">
                    <Star size={15} className="fill-star text-amber" />
                    <strong>{college.rating}</strong> ({college.review_count} Reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-hero-actions">
              <button
                className={`btn-compare-detail ${isCompared ? 'active' : ''}`}
                onClick={() => onToggleCompare(college)}
              >
                {isCompared ? '✓ Added to Comparison' : '+ Compare this College'}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="detail-tab-nav">
          <button
            className={`detail-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Building size={16} />
            <span>Overview & Campus</span>
          </button>
          <button
            className={`detail-tab ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <GraduationCap size={16} />
            <span>Courses & Fee Structure ({college.courses?.length || 0})</span>
          </button>
          <button
            className={`detail-tab ${activeTab === 'placements' ? 'active' : ''}`}
            onClick={() => setActiveTab('placements')}
          >
            <TrendingUp size={16} />
            <span>Placements & Recruiters</span>
          </button>
          <button
            className={`detail-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <MessageSquare size={16} />
            <span>Student Reviews ({college.reviews?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="detail-tab-content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane animate-fade-in">
              <div className="overview-grid">
                <div className="overview-main">
                  <h4 className="section-heading">About the Institution</h4>
                  <p className="overview-text">{college.overview}</p>

                  <h4 className="section-heading mt-4">Key Cutoffs & Entrance Exams</h4>
                  <div className="cutoff-cards-grid">
                    {college.cutoffs?.map((ct, idx) => (
                      <div key={idx} className="cutoff-badge-card">
                        <div className="cutoff-exam">{ct.exam_name}</div>
                        <div className="cutoff-branch">{ct.branch_name}</div>
                        <div className="cutoff-closing">
                          Closing Rank: <strong>{ct.closing_rank.toLocaleString()}</strong> ({ct.category})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overview-sidebar-card">
                  <h4 className="sidebar-heading">Quick Highlights</h4>
                  <div className="highlight-row">
                    <span className="hl-label">Established</span>
                    <span className="hl-value">{college.established_year}</span>
                  </div>
                  <div className="highlight-row">
                    <span className="hl-label">Institute Type</span>
                    <span className="hl-value">{college.institute_type}</span>
                  </div>
                  <div className="highlight-row">
                    <span className="hl-label">Campus Area</span>
                    <span className="hl-value">{college.campus_size}</span>
                  </div>
                  <div className="highlight-row">
                    <span className="hl-label">Accreditation</span>
                    <span className="hl-value">{college.accreditation}</span>
                  </div>
                  <div className="highlight-row">
                    <span className="hl-label">Annual Tuition Fees</span>
                    <span className="hl-value text-accent-cyan font-bold">
                      {formatFee(college.annual_fees)}/yr
                    </span>
                  </div>
                  <div className="highlight-row">
                    <span className="hl-label">Average Placement</span>
                    <span className="hl-value text-accent-emerald font-bold">
                      ₹{college.placement?.avg_ctc_lpa} LPA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSES & FEES */}
          {activeTab === 'courses' && (
            <div className="tab-pane animate-fade-in">
              <h4 className="section-heading">Offered Academic Programmes & Tuition Fees</h4>
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Degree & Programme</th>
                      <th>Level</th>
                      <th>Duration</th>
                      <th>Annual Fees</th>
                      <th>Total Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {college.courses?.map((course) => (
                      <tr key={course.id}>
                        <td>
                          <strong>{course.name}</strong>
                        </td>
                        <td>
                          <span className="course-degree-badge">{course.degree}</span>
                        </td>
                        <td>{course.duration_years} Years</td>
                        <td className="text-accent-cyan font-semibold">
                          {formatFee(course.annual_fees)} / year
                        </td>
                        <td>{course.total_seats} Seats</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PLACEMENTS */}
          {activeTab === 'placements' && (
            <div className="tab-pane animate-fade-in">
              <div className="placement-stats-header">
                <div className="stat-banner-box">
                  <span className="stat-banner-label">Highest Package</span>
                  <strong className="stat-banner-value text-accent-purple">
                    ₹{college.placement?.highest_ctc_lpa} LPA
                  </strong>
                  <span className="stat-banner-sub">Verified Global Offer</span>
                </div>

                <div className="stat-banner-box">
                  <span className="stat-banner-label">Average Package</span>
                  <strong className="stat-banner-value text-accent-emerald">
                    ₹{college.placement?.avg_ctc_lpa} LPA
                  </strong>
                  <span className="stat-banner-sub">Overall Batch Avg</span>
                </div>

                <div className="stat-banner-box">
                  <span className="stat-banner-label">Median Package</span>
                  <strong className="stat-banner-value text-accent-cyan">
                    ₹{college.placement?.median_ctc_lpa} LPA
                  </strong>
                  <span className="stat-banner-sub">50th Percentile</span>
                </div>

                <div className="stat-banner-box">
                  <span className="stat-banner-label">Placement Rate</span>
                  <strong className="stat-banner-value text-accent-amber">
                    {college.placement?.placement_rate}%
                  </strong>
                  <span className="stat-banner-sub">Placed Batch Ratio</span>
                </div>
              </div>

              <h4 className="section-heading mt-6">Top Verified Recruiting Partners</h4>
              <div className="recruiter-chips-grid">
                {college.placement?.top_recruiters?.map((recruiter, idx) => (
                  <div key={idx} className="recruiter-chip">
                    <Briefcase size={15} className="text-primary" />
                    <span>{recruiter}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="tab-pane animate-fade-in">
              <div className="reviews-header-row">
                <div>
                  <h4 className="section-heading">Verified Student Reviews</h4>
                  <p className="text-muted">Real experiences from current students and alumni.</p>
                </div>
                <div className="overall-rating-score">
                  <span className="score-num">{college.rating}</span>
                  <div className="score-stars">
                    <div className="stars-row">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-star text-amber" />
                      ))}
                    </div>
                    <span className="score-label">Based on {college.review_count} ratings</span>
                  </div>
                </div>
              </div>

              <div className="reviews-list">
                {college.reviews?.map((rev) => (
                  <div key={rev.id} className="review-card">
                    <div className="review-card-header">
                      <div>
                        <strong className="review-author">{rev.author_name}</strong>
                        {rev.verified && (
                          <span className="badge-verified">
                            <CheckCircle size={12} /> Verified Student
                          </span>
                        )}
                      </div>
                      <div className="review-rating-pill">
                        <Star size={13} className="fill-star text-amber" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <h5 className="review-headline">"{rev.headline}"</h5>
                    <p className="review-comment">{rev.comment}</p>
                    <span className="review-date">Posted on {rev.created_at}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

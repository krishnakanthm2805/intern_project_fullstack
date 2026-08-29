import React from 'react';
import { MapPin, Star, IndianRupee, TrendingUp, Award, Check, Plus, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CollegeCard({
  college,
  onViewDetails,
  isCompared,
  onToggleCompare,
  compareDisabled,
}) {
  const formatFee = (amount) => {
    if (!amount) return 'N/A';
    if (typeof amount === 'string') return amount;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
    return `₹${amount.toLocaleString()}`;
  };

  const bannerFallback = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80';
  const logoFallback = 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&auto=format&fit=crop&q=80';

  return (
    <div className={`college-card ${isCompared ? 'compared-active' : ''}`}>
      {/* Top Banner Image with Badges */}
      <div className="card-media-wrapper">
        <img
          src={college.banner_url || college.image || bannerFallback}
          alt={college.name}
          className="card-banner-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = bannerFallback;
          }}
        />
        <div className="card-media-overlay"></div>

        {college.nirf_rank && (
          <div className="card-badge nirf-badge">
            <Award size={13} />
            <span>NIRF #{college.nirf_rank}</span>
          </div>
        )}

        <div className="card-badge type-badge">
          <span>{college.institute_type || 'Institute of Eminence'}</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="card-body">
        {/* Title & Location Header */}
        <div className="card-header-row">
          <div className="card-logo-name">
            <img
              src={college.logo_url || college.image || logoFallback}
              alt=""
              className="college-logo-thumb"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = logoFallback;
              }}
            />
            <div>
              <h3 className="college-card-title" onClick={() => onViewDetails(college)}>
                {college.name}
              </h3>
              <div className="college-location-row">
                <MapPin size={14} className="text-muted" />
                <span>{college.city}, {college.state}</span>
                <span className="dot-separator">•</span>
                <ShieldCheck size={14} className="text-accent-cyan" />
                <span>{college.accreditation || 'NAAC A++ / NIRF'}</span>
              </div>
            </div>
          </div>

          <div className="rating-pill-badge">
            <Star size={14} className="star-icon fill-star" />
            <span className="rating-value">{college.rating}</span>
            <span className="rating-count">({college.review_count})</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-label">Annual Tuition Fees</span>
            <strong className="metric-value text-accent-cyan">
              {formatFee(college.annual_fees)} <small>/yr</small>
            </strong>
          </div>

          <div className="metric-box">
            <span className="metric-label">Average Placement CTC</span>
            <strong className="metric-value text-accent-emerald">
              {college.avg_ctc || (college.placement?.avg_ctc_lpa ? `₹${college.placement.avg_ctc_lpa} LPA` : '₹20+ LPA')}
            </strong>
          </div>

          <div className="metric-box">
            <span className="metric-label">Highest Package</span>
            <strong className="metric-value text-accent-purple">
              {college.highest_ctc || (college.placement?.highest_ctc_lpa ? `₹${college.placement.highest_ctc_lpa} LPA` : '₹1+ Cr')}
            </strong>
          </div>
        </div>

        {/* Top Courses Pills */}
        <div className="courses-tag-row">
          {college.courses?.slice(0, 3).map((crs) => (
            <span key={crs.id} className="course-chip">
              {crs.degree} • {crs.name.replace(/Bachelor of Technology|Bachelor of Medicine|Post Graduate Programme in Management|Master of Technology/i, '').trim()}
            </span>
          ))}
          {(!college.courses || college.courses.length === 0) && (
            <>
              <span className="course-chip">{college.degree || 'B.Tech'} • Computer Science</span>
              <span className="course-chip">{college.degree || 'B.Tech'} • Data Science & AI</span>
              <span className="course-chip more-chip">+5 More</span>
            </>
          )}
          {college.courses?.length > 3 && (
            <span className="course-chip more-chip">+{college.courses.length - 3} More</span>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="card-footer-actions">
          <button
            className={`btn-compare-toggle ${isCompared ? 'active' : ''}`}
            onClick={() => onToggleCompare(college)}
            disabled={!isCompared && compareDisabled}
            title={!isCompared && compareDisabled ? 'Maximum 3 colleges can be compared' : 'Add to side-by-side comparison'}
          >
            {isCompared ? (
              <>
                <Check size={16} />
                <span>Selected to Compare</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add to Compare</span>
              </>
            )}
          </button>

          <button
            className="btn-view-details"
            onClick={() => onViewDetails(college)}
          >
            <span>View Full Details</span>
            <ExternalLink size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

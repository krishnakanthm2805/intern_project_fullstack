import React from 'react';
import {
  Scale,
  X,
  Star,
  IndianRupee,
  TrendingUp,
  Award,
  MapPin,
  Calendar,
  Building,
  CheckCircle,
  Briefcase,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export default function CompareView({ colleges, onBack, onRemoveCollege, onViewDetails }) {
  if (!colleges || colleges.length < 2) {
    return (
      <div className="empty-state-container">
        <Scale size={48} className="text-muted mb-4" />
        <h3>Please select at least 2 colleges to compare</h3>
        <p className="text-muted">Return to the Explore tab and click "Add to Compare" on any 2 or 3 colleges.</p>
        <button className="btn-primary mt-4" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Explore
        </button>
      </div>
    );
  }

  const formatFee = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
    return `₹${amount.toLocaleString()}`;
  };

  // Compute best values for visual highlighting
  const minFee = Math.min(...colleges.map((c) => c.annual_fees));
  const maxAvgPkg = Math.max(...colleges.map((c) => c.placement?.avg_ctc_lpa || 0));
  const maxHighPkg = Math.max(...colleges.map((c) => c.placement?.highest_ctc_lpa || 0));
  const maxRating = Math.max(...colleges.map((c) => c.rating));
  const bestNirf = Math.min(...colleges.map((c) => c.nirf_rank || 999));

  return (
    <div className="compare-view-wrapper animate-fade-in">
      <div className="compare-view-header">
        <div>
          <button className="btn-back-link" onClick={onBack}>
            <ArrowLeft size={16} /> Back to College Directory
          </button>
          <h2 className="compare-page-title">
            Side-by-Side Comparison <span className="text-gradient">({colleges.length} Colleges)</span>
          </h2>
          <p className="text-muted">
            Detailed comparative matrix comparing tuition fees, placement statistics, rankings, and faculty.
          </p>
        </div>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="compare-feature-col">Parameters</th>
              {colleges.map((col) => (
                <th key={col.id} className="compare-college-header-col">
                  <div className="header-college-card">
                    <button
                      className="btn-remove-from-table"
                      onClick={() => onRemoveCollege(col.id)}
                      title="Remove from comparison"
                    >
                      <X size={14} />
                    </button>
                    <img
                      src={col.logo_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=80&auto=format&fit=crop&q=80'}
                      alt=""
                      className="compare-col-logo"
                    />
                    <h4 className="compare-col-name">{col.name}</h4>
                    <span className="compare-col-loc">
                      <MapPin size={13} /> {col.city}, {col.state}
                    </span>
                    <button
                      className="btn-view-profile-sm"
                      onClick={() => onViewDetails(col)}
                    >
                      View Profile
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* ROW: NIRF Ranking */}
            <tr>
              <td className="feature-label-cell">
                <Award size={16} className="text-accent-amber" />
                <span>NIRF Ranking</span>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className={`feature-value-cell ${col.nirf_rank === bestNirf ? 'highlight-best' : ''}`}>
                  <strong className="text-large">
                    {col.nirf_rank ? `#${col.nirf_rank}` : 'N/A'}
                  </strong>
                  {col.nirf_rank === bestNirf && <span className="best-tag">Top Rank</span>}
                </td>
              ))}
            </tr>

            {/* ROW: Rating */}
            <tr>
              <td className="feature-label-cell">
                <Star size={16} className="text-amber" />
                <span>User Rating</span>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className={`feature-value-cell ${col.rating === maxRating ? 'highlight-best' : ''}`}>
                  <div className="rating-inline">
                    <Star size={15} className="fill-star text-amber" />
                    <strong>{col.rating}</strong> / 5.0
                  </div>
                  <small className="text-subtle">({col.review_count} reviews)</small>
                </td>
              ))}
            </tr>

            {/* ROW: Annual Fees */}
            <tr>
              <td className="feature-label-cell">
                <IndianRupee size={16} className="text-accent-cyan" />
                <span>Annual Tuition Fees</span>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className={`feature-value-cell ${col.annual_fees === minFee ? 'highlight-best' : ''}`}>
                  <strong className="text-accent-cyan text-large">{formatFee(col.annual_fees)}</strong>
                  <small className="text-subtle">/ year</small>
                  {col.annual_fees === minFee && <span className="best-tag">Most Affordable</span>}
                </td>
              ))}
            </tr>

            {/* ROW: Average Placement */}
            <tr>
              <td className="feature-label-cell">
                <TrendingUp size={16} className="text-accent-emerald" />
                <span>Average Placement CTC</span>
              </td>
              {colleges.map((col) => {
                const avg = col.placement?.avg_ctc_lpa || 0;
                return (
                  <td key={col.id} className={`feature-value-cell ${avg === maxAvgPkg ? 'highlight-best' : ''}`}>
                    <strong className="text-accent-emerald text-large">₹{avg} LPA</strong>
                    {avg === maxAvgPkg && <span className="best-tag">Highest Average</span>}
                  </td>
                );
              })}
            </tr>

            {/* ROW: Highest Placement */}
            <tr>
              <td className="feature-label-cell">
                <TrendingUp size={16} className="text-accent-purple" />
                <span>Highest CTC Offered</span>
              </td>
              {colleges.map((col) => {
                const high = col.placement?.highest_ctc_lpa || 0;
                return (
                  <td key={col.id} className={`feature-value-cell ${high === maxHighPkg ? 'highlight-best' : ''}`}>
                    <strong className="text-accent-purple text-large">₹{high} LPA</strong>
                  </td>
                );
              })}
            </tr>

            {/* ROW: Institute Type & Campus */}
            <tr>
              <td className="feature-label-cell">
                <Building size={16} className="text-muted" />
                <span>Type & Campus Size</span>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className="feature-value-cell">
                  <div>{col.institute_type}</div>
                  <small className="text-muted">{col.campus_size} • Estd. {col.established_year}</small>
                </td>
              ))}
            </tr>

            {/* ROW: Key Courses Offered */}
            <tr>
              <td className="feature-label-cell">
                <Layers size={16} className="text-primary" />
                <span>Key Programmes</span>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className="feature-value-cell">
                  <div className="course-chips-stack">
                    {col.courses?.map((crs) => (
                      <span key={crs.id} className="course-chip-mini">
                        {crs.name}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* ROW: Top Recruiters */}
            <tr>
              <td className="feature-label-cell">
                <Briefcase size={16} className="text-accent-cyan" />
                <span>Top Recruiters</span>
              </td>
              {colleges.map((col) => (
                <td key={col.id} className="feature-value-cell">
                  <div className="recruiter-tags-wrap">
                    {col.placement?.top_recruiters?.map((rec, i) => (
                      <span key={i} className="recruiter-badge-sm">
                        {rec}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

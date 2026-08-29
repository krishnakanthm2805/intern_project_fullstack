import React from 'react';
import { Check, ArrowRight, Star, ExternalLink, Award } from 'lucide-react';
import { INSTITUTION_BRANDS } from '../data/collegeData';

export default function EquipmentReviewsSection({ onSelectBrand, onDiscoverAll }) {
  const highlights = [
    'Alumni Mentorship Network',
    'Transparent Fee & ROI Breakdown',
    'Verified NIRF & NAAC Accreditation',
    'Globally Recognised Degrees',
  ];

  return (
    <section id="institutions" className="equipment-reviews-section">
      <div className="section-container">
        <div className="equipment-reviews-grid">
          {/* Left Column: Heading & Value Proposition */}
          <div className="equipment-left-col">
            <h2 className="equipment-section-title">
              Reviews of Top Institutions
            </h2>

            <p className="equipment-section-desc">
              Hundreds of verified institution reviews written by academic counselors, industry placement officers, and real students alike.
            </p>

            <div className="equipment-checklist">
              {highlights.map((item, idx) => (
                <div key={idx} className="checklist-item">
                  <div className="checklist-check-icon">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              className="btn-discover-reviews"
              onClick={onDiscoverAll}
            >
              <span>Discover All 2,000+ Colleges</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Right Column: Stack of Institution Review Cards */}
          <div className="equipment-cards-stack">
            {INSTITUTION_BRANDS.map((brand) => (
              <article
                key={brand.id}
                className="equipment-brand-card"
                onClick={() => onSelectBrand(brand)}
              >
                <div className="brand-card-left">
                  <div className="brand-thumb-wrap">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="brand-thumb-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="brand-card-info">
                    <h3 className="brand-card-name">{brand.name}</h3>
                    <div className="brand-card-author-meta">
                      <span>By {brand.author}</span>
                      <span>•</span>
                      <span className="brand-card-date">{brand.date}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d97706', fontWeight: 700 }}>
                    <Star size={16} className="fill-current" />
                    <span>{brand.rating}</span>
                  </div>
                  <ExternalLink size={16} color="#9ca3af" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function Footer({ onOpenTips, onNavigateSection }) {
  return (
    <footer className="golf-footer">
      <div className="section-container">
        <div className="footer-top-grid">
          {/* Brand Col */}
          <div className="footer-col-brand">
            <div className="navbar-brand" style={{ cursor: 'default' }}>
              <div className="brand-logo-icon">
                <GraduationCap size={20} className="fill-current" />
              </div>
              <div className="brand-text-wrap">
                <span className="brand-title" style={{ fontSize: '1.15rem' }}>
                  CAMPUS <span className="brand-highlight">COMPASS</span>
                </span>
                <span className="brand-sub">The #1 Site for College Information</span>
              </div>
            </div>

            <p>
              Campus Compass provides independent, verified college cutoffs, NIRF rankings, verified placement data, and admission guides written by alumni mentors and academic counselors.
            </p>
          </div>

          {/* Col 1 */}
          <div className="footer-col">
            <h4>Engineering Guides</h4>
            <ul>
              <li><a href="#about" onClick={() => onNavigateSection('about')}>Top IITs & NITs Matrix</a></li>
              <li><a href="#about" onClick={() => onNavigateSection('about')}>Computer Science Cutoffs</a></li>
              <li><a href="#about" onClick={() => onNavigateSection('about')}>BITS Pilani vs Tier 1 IITs</a></li>
              <li><a href="#about" onClick={() => onNavigateSection('about')}>Branch Upgradation Rules</a></li>
              <li><a href="#about" onClick={() => onNavigateSection('about')}>Average CTC ROI Breakdown</a></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="footer-col">
            <h4>Management & Medical</h4>
            <ul>
              <li><a href="#hero" onClick={() => onNavigateSection('hero')}>IIM Ahmedabad & BLACKI</a></li>
              <li><a href="#hero" onClick={() => onNavigateSection('hero')}>AIIMS Delhi Cutoffs</a></li>
              <li><a href="#hero" onClick={() => onNavigateSection('hero')}>NEET UG Counseling Guide</a></li>
              <li><a href="#hero" onClick={() => onNavigateSection('hero')}>CAT Sectional Percentiles</a></li>
              <li><a href="#hero" onClick={() => onNavigateSection('hero')}>NLSIU Bangalore Law Guide</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="footer-col">
            <h4>Admissions Resources</h4>
            <ul>
              <li><a href="#tips" onClick={(e) => { e.preventDefault(); onOpenTips(); }}>Free Counseling Guide</a></li>
              <li><a href="#reviews" onClick={() => onNavigateSection('reviews')}>Spotting Fake Placements</a></li>
              <li><a href="#about" onClick={() => onNavigateSection('about')}>Freshman 101 Handbook</a></li>
              <li><a href="#institutions" onClick={() => onNavigateSection('institutions')}>Top Scholarships List</a></li>
              <li><a href="#institutions" onClick={() => onNavigateSection('institutions')}>Hostel & Mess Ratings</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} Campus Compass. All rights reserved. Verified College Admissions & Reviews Platform.
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Audited Placement Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

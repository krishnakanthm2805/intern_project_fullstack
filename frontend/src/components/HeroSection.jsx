import React, { useState } from 'react';
import { Play, Search, MapPin, BookOpen, ChevronDown, Compass, Award } from 'lucide-react';
import { heroCollegeBg, COLLEGE_STATS } from '../data/collegeData';

export default function HeroSection({
  onOpenTips,
  onOpenNewsletter,
  onSearchColleges,
  onOpenMapsModal,
}) {
  const [collegeQuery, setCollegeQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchColleges({
      query: collegeQuery,
      state: selectedState,
      degree: selectedDegree,
    });
  };

  return (
    <section id="hero" className="hero-section-wrapper">
      {/* Background 3D University Campus Landscape */}
      <div
        className="hero-backdrop-artwork"
        style={{ backgroundImage: `url(${heroCollegeBg})` }}
      />

      <div className="section-container">
        <div className="hero-grid">
          {/* Left Column: Headlines and Subscriptions */}
          <div className="hero-left-content">
            <h1 className="hero-headline">
              The <span className="hero-gold-highlight">#1 Site</span> for College Information
            </h1>

            <p className="hero-description">
              Our Academic Mentorship Team recommends engineering, medical, and business programs we actually verify.
              Try subscribing to get college cutoff tips and admission guides from top alumni coaches!
            </p>

            <div className="hero-cta-group">
              <button className="btn-hero-primary" onClick={onOpenTips}>
                <Play size={18} className="fill-current" />
                <span>Subscribe for free admission tips</span>
              </button>

              <button className="btn-hero-secondary" onClick={onOpenNewsletter}>
                <Play size={18} className="fill-current" />
                <span>Join 45,000+ Enrolled Students</span>
              </button>
            </div>
          </div>

          {/* Right Column: Discover Top Colleges Card */}
          <div className="course-finder-card">
            <div>
              <h2 className="finder-card-title">Discover the nation's top colleges</h2>
              <p className="finder-card-desc mt-1">
                In the pages of Campus Compass you will find coverage of over 2,000 of the
                nation's top universities, IITs, IIMs, and medical institutions.
              </p>
            </div>

            <form className="finder-form" onSubmit={handleSearchSubmit}>
              <div className="finder-input-wrap">
                <Search size={18} className="finder-input-icon" />
                <input
                  type="text"
                  placeholder="Enter College or Course Name"
                  className="finder-input"
                  value={collegeQuery}
                  onChange={(e) => setCollegeQuery(e.target.value)}
                />
              </div>

              <div className="finder-input-wrap">
                <MapPin size={18} className="finder-input-icon" />
                <select
                  className="finder-select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="All">By State/Region</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
                <ChevronDown size={16} className="finder-select-arrow" />
              </div>

              <div className="finder-input-wrap">
                <BookOpen size={18} className="finder-input-icon" />
                <select
                  className="finder-select"
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                >
                  <option value="All">By Degree / Stream</option>
                  <option value="B.Tech">B.Tech / Engineering</option>
                  <option value="MBA">MBA / Management</option>
                  <option value="MBBS">MBBS / Medical</option>
                  <option value="Law">Law / Jurisprudence</option>
                  <option value="B.Sc">B.Sc / Science</option>
                </select>
                <ChevronDown size={16} className="finder-select-arrow" />
              </div>

              <div className="finder-divider">
                <span>Or</span>
              </div>

              <button
                type="button"
                className="btn-search-maps"
                onClick={onOpenMapsModal}
              >
                <Compass size={18} color="#fbbf24" />
                <span>Search By Campus Maps & Cutoffs</span>
              </button>
            </form>
          </div>
        </div>

        {/* Stats Row */}
        <div className="hero-stats-bar">
          {COLLEGE_STATS.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-sub">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

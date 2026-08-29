import React from 'react';
import { Filter, RotateCcw, MapPin, IndianRupee, Star, BookOpen, ArrowUpDown } from 'lucide-react';

export default function CollegeFilters({
  filterMeta,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  maxFee,
  setMaxFee,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  onResetFilters,
  totalResults,
}) {
  const ratingOptions = [
    { label: 'All Ratings', value: '' },
    { label: '4.7+ ★ (Elite)', value: '4.7' },
    { label: '4.5+ ★ (Top Tier)', value: '4.5' },
    { label: '4.0+ ★ (Great)', value: '4.0' },
  ];

  const sortOptions = [
    { label: 'Highest Rated', value: 'rating_desc' },
    { label: 'NIRF Ranking (Top First)', value: 'rank_asc' },
    { label: 'Highest Avg Package', value: 'avg_package_desc' },
    { label: 'Fees: Low to High', value: 'fees_asc' },
    { label: 'Fees: High to Low', value: 'fees_desc' },
  ];

  const formatFee = (amount) => {
    if (!amount) return 'Any';
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} Lakh/yr`;
    return `₹${amount.toLocaleString()}/yr`;
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <div className="filter-title-group">
          <Filter size={18} className="text-primary" />
          <h3>Filters & Sorting</h3>
        </div>
        <button className="reset-btn" onClick={onResetFilters} title="Reset all filters">
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      <div className="filter-results-badge">
        Showing <strong>{totalResults}</strong> matching institutions
      </div>

      {/* Sort Option */}
      <div className="filter-group">
        <label className="filter-label">
          <ArrowUpDown size={15} />
          <span>Sort Colleges By</span>
        </label>
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Maximum Annual Fee Slider */}
      <div className="filter-group">
        <div className="filter-label-row">
          <label className="filter-label">
            <IndianRupee size={15} />
            <span>Max Annual Fees</span>
          </label>
          <span className="filter-val-badge">{maxFee ? formatFee(maxFee) : 'Up to ₹15 Lakh'}</span>
        </div>
        <input
          type="range"
          min="10000"
          max="1500000"
          step="25000"
          value={maxFee || 1500000}
          onChange={(e) => setMaxFee(e.target.value)}
          className="filter-slider"
        />
        <div className="slider-range-labels">
          <span>₹10k</span>
          <span>₹7.5L</span>
          <span>₹15L+</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="filter-group">
        <label className="filter-label">
          <Star size={15} />
          <span>Minimum Rating</span>
        </label>
        <div className="rating-pills-group">
          {ratingOptions.map((ro) => (
            <button
              key={ro.value}
              className={`rating-pill ${minRating === ro.value ? 'active' : ''}`}
              onClick={() => setMinRating(ro.value)}
            >
              {ro.label}
            </button>
          ))}
        </div>
      </div>

      {/* State Filter */}
      <div className="filter-group">
        <label className="filter-label">
          <MapPin size={15} />
          <span>State / Region</span>
        </label>
        <select
          className="filter-select"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="All">All States</option>
          {filterMeta?.states?.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div className="filter-group">
        <label className="filter-label">
          <MapPin size={15} />
          <span>City</span>
        </label>
        <select
          className="filter-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="All">All Cities</option>
          {filterMeta?.cities?.map((ct) => (
            <option key={ct} value={ct}>
              {ct}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

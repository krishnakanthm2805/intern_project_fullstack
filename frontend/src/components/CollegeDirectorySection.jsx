import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, RotateCcw, MapPin, IndianRupee, Star, BookOpen, ArrowUpDown, ChevronLeft, ChevronRight, GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import CollegeCard from './CollegeCard';
import { fetchColleges, fetchFilterMeta } from '../services/api';

export default function CollegeDirectorySection({
  onViewDetails,
  onToggleCompare,
  comparedColleges = [],
}) {
  // Helper to read current URL searchParams
  const getInitialParams = () => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get('q') || '',
      state: params.get('state') || 'All',
      city: params.get('city') || 'All',
      degree: params.get('degree') || 'All',
      max_fee: params.get('max_fee') || '',
      min_rating: params.get('min_rating') || '',
      sort: params.get('sort') || 'rating_desc',
      page: parseInt(params.get('page') || '1', 10),
    };
  };

  const initial = getInitialParams();

  // Search & Filter State (synced with URL searchParams)
  const [searchQuery, setSearchQuery] = useState(initial.q || '');
  const [selectedState, setSelectedState] = useState(initial.state || 'All');
  const [selectedCity, setSelectedCity] = useState(initial.city || 'All');
  const [selectedDegree, setSelectedDegree] = useState(initial.degree || 'All');
  const [maxFee, setMaxFee] = useState(initial.max_fee || '');
  const [minRating, setMinRating] = useState(initial.min_rating || '');
  const [sortBy, setSortBy] = useState(initial.sort || 'rating_desc');
  const [currentPage, setCurrentPage] = useState(initial.page || 1);

  // Data & Metadata
  const [colleges, setColleges] = useState([]);
  const [filterMeta, setFilterMeta] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 6, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Synchronize state with URL searchParams without page reloads
  const updateUrlParams = useCallback((newParams) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();

    if (newParams.q) params.set('q', newParams.q);
    if (newParams.state && newParams.state !== 'All') params.set('state', newParams.state);
    if (newParams.city && newParams.city !== 'All') params.set('city', newParams.city);
    if (newParams.degree && newParams.degree !== 'All') params.set('degree', newParams.degree);
    if (newParams.max_fee) params.set('max_fee', newParams.max_fee);
    if (newParams.min_rating) params.set('min_rating', newParams.min_rating);
    if (newParams.sort && newParams.sort !== 'rating_desc') params.set('sort', newParams.sort);
    if (newParams.page && newParams.page > 1) params.set('page', newParams.page.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, []);

  // Listen to browser back/forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const p = getInitialParams();
      setSearchQuery(p.q || '');
      setSelectedState(p.state || 'All');
      setSelectedCity(p.city || 'All');
      setSelectedDegree(p.degree || 'All');
      setMaxFee(p.max_fee || '');
      setMinRating(p.min_rating || '');
      setSortBy(p.sort || 'rating_desc');
      setCurrentPage(p.page || 1);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load Filter Metadata on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const metaRes = await fetchFilterMeta();
        if (metaRes.success) {
          setFilterMeta(metaRes.data);
        }
      } catch (err) {
        console.warn('Metadata loading:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch colleges whenever query or filters change
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const currentFilterState = {
          q: searchQuery,
          state: selectedState,
          city: selectedCity,
          degree: selectedDegree,
          max_fee: maxFee,
          min_rating: minRating,
          sort: sortBy,
          page: currentPage,
          limit: 6,
        };

        // Update URL query parameters (searchParams)
        updateUrlParams(currentFilterState);

        const res = await fetchColleges(currentFilterState);
        if (!isCancelled && res.success) {
          setColleges(res.data);
          setPagination(res.pagination || { total: res.total || res.data.length, page: currentPage, limit: 6, totalPages: res.totalPages || 1 });
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to fetch colleges');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(loadData, searchQuery ? 250 : 0);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedState, selectedCity, selectedDegree, maxFee, minRating, sortBy, currentPage, updateUrlParams]);

  // Reset Filters Handler
  const handleReset = () => {
    setSearchQuery('');
    setSelectedState('All');
    setSelectedCity('All');
    setSelectedDegree('All');
    setMaxFee('');
    setMinRating('');
    setSortBy('rating_desc');
    setCurrentPage(1);
  };

  const ratingOptions = [
    { label: 'All', value: '' },
    { label: '4.8+ ★', value: '4.8' },
    { label: '4.5+ ★', value: '4.5' },
    { label: '4.0+ ★', value: '4.0' },
  ];

  const sortOptions = [
    { label: 'Highest Rated ★', value: 'rating_desc' },
    { label: 'NIRF Ranking (Top 1st)', value: 'rank_asc' },
    { label: 'Highest Avg CTC Package', value: 'avg_package_desc' },
    { label: 'Fees: Low to High', value: 'fees_asc' },
    { label: 'Fees: High to Low', value: 'fees_desc' },
  ];

  const formatFee = (val) => {
    if (!val) return 'Any';
    const num = parseInt(val, 10);
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} Lakh/yr`;
    return `₹${num.toLocaleString()}/yr`;
  };

  return (
    <section id="directory" className="tell-me-more-section" style={{ background: '#07180e', padding: '5rem 0' }}>
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-center" style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-title-large">
            Explore & Filter <span className="section-title-highlight">2,000+ Colleges</span>
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '0.5rem' }}>
            Instant multi-parameter search, fee slider, state filters & NIRF rankings synchronized with URL query params
          </p>
        </div>

        {/* Search Bar Row */}
        <div style={{
          maxWidth: '840px',
          margin: '0 auto 2.5rem',
          position: 'relative',
        }}>
          <div className="finder-input-wrap" style={{ background: 'rgba(12, 33, 21, 0.9)', borderRadius: '14px', border: '1.5px solid rgba(251, 191, 36, 0.35)', padding: '0.35rem 0.6rem' }}>
            <Search size={20} color="#fbbf24" style={{ marginLeft: '0.5rem', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by college name, city, NIRF rank, or degree (e.g. 'IIT Bombay', 'Mumbai', 'B.Tech')..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ color: '#9ca3af', padding: '0.5rem', fontSize: '0.85rem' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Directory Layout: Left Sidebar + Right College Listings */}
        <div className="directory-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Left Multi-Filters Sidebar */}
          <aside className="filter-sidebar" style={{
            background: 'rgba(12, 33, 21, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            borderRadius: '18px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            position: 'sticky',
            top: '80px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 700, fontSize: '1rem' }}>
                <Filter size={18} />
                <span>Multi-Filters</span>
              </div>
              <button
                onClick={handleReset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  color: '#9ca3af',
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                }}
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#9ca3af', background: 'rgba(251, 191, 36, 0.1)', padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
              Showing <strong style={{ color: '#fbbf24' }}>{pagination.total}</strong> verified colleges
            </div>

            {/* Sort Options */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.4rem' }}>
                <ArrowUpDown size={14} color="#fbbf24" />
                <span>Sort Colleges By</span>
              </label>
              <select
                className="finder-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ background: 'rgba(5, 17, 10, 0.8)', padding: '0.6rem 0.85rem' }}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Max Annual Fee Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb' }}>
                  <IndianRupee size={14} color="#fbbf24" />
                  <span>Max Annual Fees</span>
                </label>
                <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }}>
                  {maxFee ? formatFee(maxFee) : 'Up to ₹15 Lakh'}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="1500000"
                step="50000"
                value={maxFee || 1500000}
                onChange={(e) => {
                  setMaxFee(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ width: '100%', accentColor: '#fbbf24', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                <span>₹50k</span>
                <span>₹7.5L</span>
                <span>₹15L+</span>
              </div>
            </div>

            {/* State Filter */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.4rem' }}>
                <MapPin size={14} color="#fbbf24" />
                <span>State / Region</span>
              </label>
              <select
                className="finder-select"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ background: 'rgba(5, 17, 10, 0.8)', padding: '0.6rem 0.85rem' }}
              >
                <option value="All">All States</option>
                {filterMeta?.states?.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Degree Stream */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.4rem' }}>
                <BookOpen size={14} color="#fbbf24" />
                <span>Degree / Stream</span>
              </label>
              <select
                className="finder-select"
                value={selectedDegree}
                onChange={(e) => {
                  setSelectedDegree(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ background: 'rgba(5, 17, 10, 0.8)', padding: '0.6rem 0.85rem' }}
              >
                <option value="All">All Degrees</option>
                <option value="B.Tech">B.Tech / Engineering</option>
                <option value="MBA">MBA / Management</option>
                <option value="MBBS">MBBS / Medical</option>
                <option value="Dual Degree">Dual Degree</option>
                <option value="Law">Law / LLB</option>
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.4rem' }}>
                <Star size={14} color="#fbbf24" />
                <span>Minimum Rating</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                {ratingOptions.map((ro) => (
                  <button
                    key={ro.value}
                    style={{
                      background: minRating === ro.value ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.06)',
                      color: minRating === ro.value ? '#0b1c11' : '#d1d5db',
                      fontWeight: minRating === ro.value ? 700 : 500,
                      padding: '0.35rem 0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => {
                      setMinRating(ro.value);
                      setCurrentPage(1);
                    }}
                  >
                    {ro.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right College Listings */}
          <section>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(12, 33, 21, 0.5)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Loader2 size={36} color="#fbbf24" className="spinner-icon" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                <p style={{ color: '#d1d5db', fontSize: '1rem' }}>Loading college database...</p>
              </div>
            ) : error ? (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.5rem', borderRadius: '14px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            ) : colleges.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(12, 33, 21, 0.5)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <GraduationCap size={48} color="#9ca3af" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' }}>No Colleges Found</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  No institutions match your search and filter criteria. Try clearing search keywords or resetting fee and state filters.
                </p>
                <button className="btn-hero-primary" onClick={handleReset}>
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {colleges.map((college) => {
                  const isCompared = comparedColleges.some((c) => c.id === college.id);
                  return (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      onViewDetails={onViewDetails}
                      isCompared={isCompared}
                      onToggleCompare={onToggleCompare}
                      compareDisabled={comparedColleges.length >= 3}
                    />
                  );
                })}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                    <button
                      className="btn-hero-secondary"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', opacity: currentPage <= 1 ? 0.4 : 1 }}
                    >
                      <ChevronLeft size={16} />
                      <span>Prev</span>
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: currentPage === pageNum ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.08)',
                          color: currentPage === pageNum ? '#0b1c11' : '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'pointer',
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      className="btn-hero-secondary"
                      disabled={currentPage >= pagination.totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', opacity: currentPage >= pagination.totalPages ? 0.4 : 1 }}
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

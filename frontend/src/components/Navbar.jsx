import React, { useState } from 'react';
import { GraduationCap, Sparkles, Menu, X, ChevronRight, Scale, Search } from 'lucide-react';

export default function Navbar({
  onOpenTips,
  onNavigateSection,
  activeSection,
  compareCount = 0,
  onOpenCompare,
  dbStatus,
  onOpenDbModal,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isConnected = dbStatus?.database?.connected || dbStatus?.connected;
  const isApiOnline = dbStatus?.status === 'ok' || dbStatus?.platform;

  const navItems = [
    { label: 'Explore Colleges', target: 'directory' },
    { label: 'Engineering Guides', target: 'about' },
    { label: 'Management & MBA', target: 'about' },
    { label: 'Campus Reviews', target: 'reviews' },
    { label: 'Top Institutions', target: 'institutions' },
  ];

  const handleNavClick = (target) => {
    onNavigateSection(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => handleNavClick('hero')}>
          <div className="brand-logo-icon">
            <GraduationCap size={22} className="fill-current" />
          </div>
          <div className="brand-text-wrap">
            <span className="brand-title">
              CAMPUS <span className="brand-highlight">COMPASS</span>
            </span>
            <span className="brand-sub">College Discovery & Admissions</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={`#${item.target}`}
              className={`nav-link ${activeSection === item.target ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.target);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Database Live Status Badge */}
          <button
            className="btn-db-status"
            onClick={onOpenDbModal}
            title="Click to view fullstack PostgreSQL & API diagnostics"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.45rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: isConnected
                ? '1px solid rgba(16, 185, 129, 0.4)'
                : '1px solid rgba(245, 158, 11, 0.4)',
              background: isConnected
                ? 'rgba(16, 185, 129, 0.12)'
                : 'rgba(245, 158, 11, 0.12)',
              color: isConnected ? '#34d399' : '#fcd34d',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isConnected ? '#10b981' : isApiOnline ? '#f59e0b' : '#ef4444',
                boxShadow: isConnected ? '0 0 8px #10b981' : '0 0 8px #f59e0b',
                display: 'inline-block',
              }}
            />
            <span>{isConnected ? 'PostgreSQL Live' : 'In-Memory Ready'}</span>
          </button>

          {compareCount > 0 && (
            <button
              className="btn-hero-secondary"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem', gap: '0.4rem' }}
              onClick={onOpenCompare}
            >
              <Scale size={15} color="#fbbf24" />
              <span>Compare ({compareCount})</span>
            </button>
          )}

          <button
            className="btn-free-tips"
            onClick={onOpenTips}
            title="Get personalized college admission guidance"
          >
            <Sparkles size={16} />
            <span>Free Counseling Tips</span>
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer animate-fade-in" style={{
          background: 'rgba(7, 21, 12, 0.98)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {navItems.map((item, idx) => (
            <button
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ffffff',
                fontSize: '1.05rem',
                fontWeight: 600,
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'left',
              }}
              onClick={() => handleNavClick(item.target)}
            >
              <span>{item.label}</span>
              <ChevronRight size={18} color="#fbbf24" />
            </button>
          ))}
          <button
            className="btn-free-tips"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTips();
            }}
          >
            <Sparkles size={16} />
            <span>Free Counseling Tips</span>
          </button>
        </div>
      )}
    </header>
  );
}

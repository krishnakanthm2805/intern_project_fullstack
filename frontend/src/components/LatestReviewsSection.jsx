import React, { useState } from 'react';
import { LATEST_COLLEGE_REVIEWS, SIDEBAR_COLLEGE_ARTICLES } from '../data/collegeData';
import { Star, FileText, Check } from 'lucide-react';

export default function LatestReviewsSection({ onSelectReview, onSubscribeEmail }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sidebarEmail, setSidebarEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filterTabs = ['All', 'Top NIRF Ranked', 'Highest Placements', 'Best ROI & Value'];

  const filteredReviews = activeFilter === 'All'
    ? LATEST_COLLEGE_REVIEWS
    : LATEST_COLLEGE_REVIEWS.filter((item) => item.category.toLowerCase() === activeFilter.toLowerCase());

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!sidebarEmail || !sidebarEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    onSubscribeEmail(sidebarEmail);
    setSubscribed(true);
    setSidebarEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <section id="reviews" className="latest-reviews-section">
      <div className="section-container">
        {/* Header Bar with Filter Tabs */}
        <div className="reviews-header-bar">
          <h2 className="reviews-section-title">Latest Reviews</h2>

          <div className="reviews-filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`filter-tab-btn ${activeFilter === tab ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid: 2x2 Grid on Left, Sidebar on Right */}
        <div className="reviews-main-grid">
          {/* Left 2x2 Grid */}
          <div className="featured-reviews-grid">
            {filteredReviews.map((review) => (
              <article
                key={review.id}
                className="review-card-item"
                onClick={() => onSelectReview(review)}
              >
                <div className="review-card-thumb-wrap">
                  <img
                    src={review.image}
                    alt={review.title}
                    className="review-card-thumb"
                    loading="lazy"
                  />
                  <span className="review-card-meta-tag">{review.category}</span>
                </div>

                <div className="review-card-content">
                  <h3 className="review-card-title">{review.title}</h3>
                  <p className="review-card-desc">{review.subtitle || review.excerpt}</p>

                  <div className="review-card-footer">
                    <div className="author-chip">
                      <div className="author-avatar-placeholder">AM</div>
                      <span>By {review.author}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24' }}>
                      <Star size={14} className="fill-current" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right Column: Quick Reviews & Subscribe Box */}
          <aside className="reviews-sidebar-wrap">
            {/* Quick Articles List */}
            <div className="sidebar-list-card">
              <h3 className="sidebar-heading">
                <FileText size={18} color="#fbbf24" />
                <span>Trending Admission Guides</span>
              </h3>

              <div className="sidebar-articles-stack">
                {SIDEBAR_COLLEGE_ARTICLES.map((item) => (
                  <div
                    key={item.id}
                    className="sidebar-article-item"
                    onClick={() =>
                      onSelectReview({
                        title: item.title,
                        author: item.author,
                        date: item.date,
                        category: item.category,
                        readTime: item.readTime,
                        excerpt: `In-depth analysis and strategic recommendations for "${item.title}". Our academic counselor network breaks down the core factors, admission rules, and preparation timeline.`,
                        pros: ['Verified against official JoSAA & exam guidelines', 'Real student feedback incorporated', 'Clear actionable checklist'],
                        cons: ['Cutoffs fluctuate yearly based on exam applicant volume'],
                        verdict: `Essential reading for students and parents aiming to make informed college choices.`,
                      })
                    }
                  >
                    <div className="sidebar-article-icon">
                      <FileText size={16} />
                    </div>
                    <div className="sidebar-article-info">
                      <h4 className="sidebar-article-title">{item.title}</h4>
                      <div className="sidebar-article-meta">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>By {item.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscribe Banner */}
            <div className="sidebar-subscribe-box">
              <h3 className="subscribe-box-title">Subscribe now</h3>
              <p className="subscribe-box-desc">to get daily cutoff alerts & exam news</p>

              <form className="subscribe-form-row" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="subscribe-input"
                  value={sidebarEmail}
                  onChange={(e) => setSidebarEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-subscribe-now">
                  {subscribed ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Check size={16} /> Subscribed!
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

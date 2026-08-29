import React from 'react';
import { COLLEGE_CATEGORIES } from '../data/collegeData';
import { ArrowRight, BookOpen, Compass } from 'lucide-react';

export default function TellMeMoreAbout({ onSelectCategory }) {
  const fallbackImg = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80';

  return (
    <section id="about" className="tell-me-more-section">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-center">
          <h2 className="section-title-large">
            Tell Me More <span className="section-title-highlight">About</span>
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '0.5rem' }}>
            In-depth academic streams, counseling blueprints, and freshman roadmaps
          </p>
        </div>

        {/* 3 Main Highlight Feature Cards */}
        <div className="category-cards-grid">
          {COLLEGE_CATEGORIES.map((cat) => (
            <article
              key={cat.id}
              className="category-card"
              onClick={() => onSelectCategory(cat)}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-card-img-wrap">
                <img
                  src={cat.image || fallbackImg}
                  alt={cat.title}
                  className="category-card-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImg;
                  }}
                />
                <span className="category-badge">{cat.tag}</span>
              </div>

              <div className="category-card-body">
                <h3 className="category-card-title">{cat.title}</h3>
                <p className="category-card-excerpt">{cat.excerpt}</p>

                <button
                  className="btn-learn-more"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(cat);
                  }}
                  aria-label={`Learn more about ${cat.title}`}
                >
                  <span>Learn More</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

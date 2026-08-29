import React from 'react';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

export default function CompareDrawer({
  comparedColleges,
  onRemoveCollege,
  onOpenCompare,
  onClearAll,
}) {
  if (!comparedColleges || comparedColleges.length === 0) return null;

  return (
    <div className="compare-drawer animate-slide-up">
      <div className="compare-drawer-inner">
        <div className="drawer-info">
          <div className="drawer-icon-wrap">
            <Scale size={20} className="text-primary" />
          </div>
          <div>
            <span className="drawer-title">
              Comparison Dock ({comparedColleges.length}/3 Colleges)
            </span>
            <span className="drawer-sub">
              {comparedColleges.length < 2
                ? 'Select at least 1 more college to compare side-by-side'
                : 'Ready to compare side-by-side!'}
            </span>
          </div>
        </div>

        {/* Selected College Chips */}
        <div className="drawer-chips-list">
          {comparedColleges.map((col) => (
            <div key={col.id} className="drawer-college-chip">
              <img
                src={col.logo_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=50&auto=format&fit=crop&q=80'}
                alt=""
                className="chip-logo"
              />
              <span className="chip-name">{col.name.split('(')[0].trim()}</span>
              <button
                className="chip-remove-btn"
                onClick={() => onRemoveCollege(col.id)}
                title="Remove"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* Placeholder Slots if less than 3 */}
          {[...Array(3 - comparedColleges.length)].map((_, i) => (
            <div key={i} className="drawer-slot-empty">
              <span>+ Add College</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="drawer-actions">
          <button className="btn-clear-compare" onClick={onClearAll} title="Clear comparison">
            <Trash2 size={16} />
            <span>Clear</span>
          </button>

          <button
            className="btn-launch-compare"
            disabled={comparedColleges.length < 2}
            onClick={onOpenCompare}
          >
            <span>Compare Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

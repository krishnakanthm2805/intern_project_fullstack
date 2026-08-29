import React, { useState } from 'react';
import { Target, Sparkles, AlertCircle, CheckCircle2, TrendingUp, Award, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { predictAdmission } from '../services/api';

export default function PredictorTool({ onViewCollegeDetails, onToggleCompare, comparedIds }) {
  const [exam, setExam] = useState('JEE Main');
  const [rank, setRank] = useState('4500');
  const [category, setCategory] = useState('General');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeChanceTab, setActiveChanceTab] = useState('all');

  const examOptions = [
    { name: 'JEE Main', desc: 'NITs, IIITs, GFTIs, VIT', defaultRank: '4500' },
    { name: 'JEE Advanced', desc: 'IIT Bombay, IIT Delhi, etc.', defaultRank: '500' },
    { name: 'NEET', desc: 'AIIMS, Medical Colleges', defaultRank: '150' },
    { name: 'CAT', desc: 'IIMs & Top B-Schools (Percentile)', defaultRank: '99' },
    { name: 'BITSAT', desc: 'BITS Pilani Campuses (Score)', defaultRank: '310' },
    { name: 'GATE', desc: 'M.Tech / PSU Recruitment', defaultRank: '750' },
    { name: 'VITEEE', desc: 'VIT Vellore / Chennai', defaultRank: '8500' },
  ];

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    if (!rank || isNaN(rank)) {
      setError('Please enter a valid numeric rank / score');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await predictAdmission({ exam, rank, category });
      setResults(res);
    } catch (err) {
      setError(err.message || 'Failed to generate college predictions');
    } finally {
      setLoading(false);
    }
  };

  const handleExamChange = (newExam) => {
    setExam(newExam);
    const matched = examOptions.find((o) => o.name === newExam);
    if (matched) setRank(matched.defaultRank);
  };

  // Filter results according to chance tab
  const getFilteredList = () => {
    if (!results?.data) return [];
    if (activeChanceTab === 'safe') return results.grouped.safe;
    if (activeChanceTab === 'target') return results.grouped.target;
    if (activeChanceTab === 'reach') return results.grouped.reach;
    return results.data;
  };

  const filteredList = getFilteredList();

  return (
    <div className="predictor-container animate-fade-in">
      {/* Header Banner */}
      <div className="predictor-header">
        <div className="hero-badge">
          <Sparkles size={14} className="hero-sparkle-icon" />
          <span>Algorithmic Cutoff Predictor Engine</span>
        </div>
        <h2 className="predictor-title">
          College & Branch <span className="text-gradient">Admission Predictor</span>
        </h2>
        <p className="predictor-desc">
          Enter your entrance exam rank or percentile to predict your admission probability into top programs across India.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="predictor-card">
        <form onSubmit={handlePredict} className="predictor-form">
          <div className="predictor-form-grid">
            {/* Exam Selector */}
            <div className="form-group">
              <label className="form-label">
                <Target size={15} />
                <span>Target Entrance Exam</span>
              </label>
              <select
                className="form-select"
                value={exam}
                onChange={(e) => handleExamChange(e.target.value)}
              >
                {examOptions.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name} ({opt.desc})
                  </option>
                ))}
              </select>
            </div>

            {/* Rank Input */}
            <div className="form-group">
              <label className="form-label">
                <Award size={15} />
                <span>Your All-India Rank / Score</span>
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 4500"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                min="1"
                required
              />
            </div>

            {/* Category Selector */}
            <div className="form-group">
              <label className="form-label">
                <CheckCircle2 size={15} />
                <span>Seat Category</span>
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General / Open</option>
                <option value="OBC">OBC-NCL</option>
                <option value="SC/ST">SC / ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>

          <div className="predictor-action-row">
            <button type="submit" className="btn-predict-submit" disabled={loading}>
              {loading ? (
                <span>Analyzing Cutoff Datasets...</span>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Predict College Opportunities</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="predictor-results-section animate-slide-up">
          <div className="results-summary-box">
            <div>
              <h3 className="results-heading">
                Found <strong>{results.totalMatches} Matching Branches</strong> for {results.input.exam} (Rank {results.input.rank})
              </h3>
              <p className="text-muted">
                Matched based on official previous-year cutoff trends and historical counselling rounds.
              </p>
            </div>

            {/* Probability Segment Tabs */}
            <div className="chance-tabs-row">
              <button
                className={`chance-tab ${activeChanceTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveChanceTab('all')}
              >
                All Matches ({results.data.length})
              </button>
              <button
                className={`chance-tab safe ${activeChanceTab === 'safe' ? 'active' : ''}`}
                onClick={() => setActiveChanceTab('safe')}
              >
                🟢 High Chance / Safe ({results.grouped.safe.length})
              </button>
              <button
                className={`chance-tab target ${activeChanceTab === 'target' ? 'active' : ''}`}
                onClick={() => setActiveChanceTab('target')}
              >
                🟡 Moderate / Target ({results.grouped.target.length})
              </button>
              <button
                className={`chance-tab reach ${activeChanceTab === 'reach' ? 'active' : ''}`}
                onClick={() => setActiveChanceTab('reach')}
              >
                🔴 Reach / Dream ({results.grouped.reach.length})
              </button>
            </div>
          </div>

          {filteredList.length === 0 ? (
            <div className="empty-results-box">
              <AlertCircle size={32} className="text-muted mb-2" />
              <p>No colleges found in this category for your current rank. Try checking the "All Matches" or adjusting your rank input.</p>
            </div>
          ) : (
            <div className="predictions-cards-grid">
              {filteredList.map((item, idx) => {
                const isCompared = comparedIds?.includes(item.college_id);

                return (
                  <div key={idx} className={`prediction-result-card border-${item.badgeColor}`}>
                    <div className="pred-card-header">
                      <div className="pred-college-info">
                        <img src={item.logo_url} alt="" className="pred-logo" />
                        <div>
                          <h4 className="pred-college-title">{item.college_name}</h4>
                          <span className="pred-loc">
                            <MapPin size={13} /> {item.city}, {item.state}
                          </span>
                        </div>
                      </div>

                      <div className={`chance-tag-badge bg-${item.badgeColor}`}>
                        <span>{item.chance}</span>
                        <strong>{item.chancePercentage}% Probable</strong>
                      </div>
                    </div>

                    <div className="pred-branch-box">
                      <div className="pred-branch-name">{item.branch_name}</div>
                      <div className="pred-cutoff-row">
                        <span>Closing Cutoff: <strong>Rank {item.closing_rank.toLocaleString()}</strong></span>
                        <span className="dot">•</span>
                        <span>Your Rank: <strong>{item.user_rank.toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <div className="pred-metrics-row">
                      <div className="pred-metric">
                        <span className="label">NIRF Rank</span>
                        <strong className="val">{item.nirf_rank ? `#${item.nirf_rank}` : 'Top 50'}</strong>
                      </div>
                      <div className="pred-metric">
                        <span className="label">Annual Fees</span>
                        <strong className="val text-accent-cyan">₹{(item.annual_fees / 100000).toFixed(1)}L/yr</strong>
                      </div>
                      <div className="pred-metric">
                        <span className="label">Average CTC</span>
                        <strong className="val text-accent-emerald">₹{item.avg_ctc_lpa} LPA</strong>
                      </div>
                    </div>

                    <div className="pred-actions-row">
                      <button
                        className={`btn-pred-compare ${isCompared ? 'active' : ''}`}
                        onClick={() => onToggleCompare({ id: item.college_id, name: item.college_name, logo_url: item.logo_url })}
                      >
                        {isCompared ? '✓ Added' : '+ Add to Compare'}
                      </button>

                      <button
                        className="btn-pred-details"
                        onClick={() => onViewCollegeDetails(item.slug)}
                      >
                        <span>View College Profile</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

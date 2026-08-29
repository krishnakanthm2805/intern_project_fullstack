import React from 'react';
import { Users, UserCheck, ShieldAlert, Cpu } from 'lucide-react';

export function StatsBar({ totalUsers, filterCount, dbStatus }) {
  const isFiltered = filterCount !== totalUsers;

  return (
    <section className="stats-grid" aria-label="System Metrics">
      {/* Total Users */}
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{totalUsers}</span>
        </div>
        <div className="stat-icon-wrapper stat-icon-indigo">
          <Users size={24} />
        </div>
      </div>

      {/* Filtered Matches */}
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">{isFiltered ? 'Filtered Results' : 'Active Records'}</span>
          <span className="stat-value">{filterCount}</span>
        </div>
        <div className="stat-icon-wrapper stat-icon-cyan">
          <UserCheck size={24} />
        </div>
      </div>

      {/* Database Mode */}
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Data Engine</span>
          <span className="stat-value" style={{ fontSize: '1.25rem', paddingTop: '0.2rem' }}>
            {dbStatus?.connected ? 'PostgreSQL' : 'In-Memory Store'}
          </span>
        </div>
        <div className="stat-icon-wrapper stat-icon-emerald">
          <Cpu size={24} />
        </div>
      </div>
    </section>
  );
}

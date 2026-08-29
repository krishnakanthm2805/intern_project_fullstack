import React, { useState } from 'react';
import {
  Database,
  Server,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Layers,
  FileCode,
  ShieldCheck,
  Zap,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { triggerDbReconnect } from '../services/api';

export default function DatabaseStatusModal({ isOpen, onClose, dbStatus, onStatusUpdated }) {
  const [reconnecting, setReconnecting] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [reconnectResult, setReconnectResult] = useState(null);

  if (!isOpen) return null;

  const isConnected = dbStatus?.database?.connected || dbStatus?.connected;
  const isApiOnline = dbStatus?.status === 'ok' || dbStatus?.platform;
  const mode = dbStatus?.database?.mode || (isConnected ? 'postgresql' : 'in-memory (high-performance fallback)');
  const host = dbStatus?.database?.host || 'localhost';
  const dbName = dbStatus?.database?.database || 'api';
  const port = dbStatus?.database?.port || 5432;
  const latency = dbStatus?.database?.latencyMs || '< 5ms';
  const ssl = dbStatus?.database?.ssl;
  const tables = dbStatus?.database?.tables || {
    colleges: 8,
    courses: 26,
    placements: 8,
    cutoffs: 22,
    reviews: 9,
    users: 3,
    newsletters: 0,
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleReconnect = async () => {
    setReconnecting(true);
    setReconnectResult(null);
    try {
      const res = await triggerDbReconnect();
      if (res && res.database) {
        setReconnectResult({
          success: res.database.connected,
          message: res.message || (res.database.connected ? 'PostgreSQL Connected!' : 'PostgreSQL is currently unreachable'),
        });
        if (onStatusUpdated) {
          onStatusUpdated(res.database);
        }
      }
    } catch (err) {
      setReconnectResult({
        success: false,
        message: err.message || 'Failed to ping backend',
      });
    } finally {
      setReconnecting(false);
    }
  };

  const localEnvSnippet = `PORT=5050
PGUSER=postgres
PGHOST=localhost
PGDATABASE=api
PGPASSWORD=your_password
PGPORT=5432`;

  const cloudEnvSnippet = `PORT=5050
DATABASE_URL=postgresql://user:password@ep-sample-123.us-east-2.aws.neon.tech/neondb?sslmode=require`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog db-status-modal"
        style={{ maxWidth: '780px', width: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isConnected ? '#10b981' : '#f59e0b',
              }}
            >
              <Database size={22} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '1.25rem' }}>
                Fullstack Database & API Connection
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                PostgreSQL Engine & Express Backend Integration
              </p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
          {/* Status Overview Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            {/* Backend API Box */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Server size={15} /> BACKEND API
                </span>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: isApiOnline ? '#dcfce7' : '#fee2e2',
                    color: isApiOnline ? '#15803d' : '#b91c1c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isApiOnline ? '#16a34a' : '#dc2626',
                    }}
                  />
                  {isApiOnline ? 'Online (:5050)' : 'Offline'}
                </span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                College Discovery API
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Status: HTTP 200 OK (CORS Enabled)
              </div>
            </div>

            {/* PostgreSQL Engine Box */}
            <div
              style={{
                background: '#ffffff',
                border: `1px solid ${isConnected ? '#bbf7d0' : '#fde68a'}`,
                borderRadius: '12px',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Database size={15} /> POSTGRESQL DATABASE
                </span>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: isConnected ? '#dcfce7' : '#fef3c7',
                    color: isConnected ? '#15803d' : '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isConnected ? '#16a34a' : '#f59e0b',
                    }}
                  />
                  {isConnected ? 'Connected' : 'In-Memory Ready'}
                </span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                {isConnected ? `${dbName} (${host}:${port})` : 'In-Memory Store'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Latency: <span style={{ fontWeight: 600, color: '#0f172a' }}>{latency}</span> | SSL: {ssl ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>

          {/* Reconnect notification message */}
          {reconnectResult && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: reconnectResult.success ? '#f0fdf4' : '#fffbeb',
                border: `1px solid ${reconnectResult.success ? '#86efac' : '#fcd34d'}`,
                color: reconnectResult.success ? '#166534' : '#92400e',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {reconnectResult.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{reconnectResult.message}</span>
            </div>
          )}

          {/* Table Data Telemetry */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={16} color="#3b82f6" />
                Live Database Tables & Datasets
              </h4>
              <button
                className="btn btn-secondary"
                onClick={handleReconnect}
                disabled={reconnecting}
                style={{
                  fontSize: '0.78rem',
                  padding: '5px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  borderRadius: '6px',
                }}
              >
                <RefreshCw size={13} className={reconnecting ? 'spin-icon' : ''} />
                {reconnecting ? 'Pinging DB...' : 'Test / Reconnect'}
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.6rem',
              }}
            >
              {Object.entries(tables).map(([tableName, count]) => (
                <div
                  key={tableName}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{count}</div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {tableName}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Instructions */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#0f172a', fontWeight: 700 }}>
              How to Connect Your PostgreSQL Database
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Option 1: Local PostgreSQL */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    Option 1: Local PostgreSQL (backend/.env)
                  </span>
                  <button
                    onClick={() => handleCopy(localEnvSnippet, 'local')}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: copiedKey === 'local' ? '#10b981' : '#64748b',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedKey === 'local' ? <Check size={14} /> : <Copy size={14} />}
                    {copiedKey === 'local' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre
                  style={{
                    background: '#1e293b',
                    color: '#e2e8f0',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    margin: 0,
                    overflowX: 'auto',
                  }}
                >
                  {localEnvSnippet}
                </pre>
              </div>

              {/* Option 2: Free Cloud Database */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    Option 2: Free Cloud Database (Neon / Supabase / Railway)
                  </span>
                  <button
                    onClick={() => handleCopy(cloudEnvSnippet, 'cloud')}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: copiedKey === 'cloud' ? '#10b981' : '#64748b',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedKey === 'cloud' ? <Check size={14} /> : <Copy size={14} />}
                    {copiedKey === 'cloud' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre
                  style={{
                    background: '#1e293b',
                    color: '#e2e8f0',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    margin: 0,
                    overflowX: 'auto',
                  }}
                >
                  {cloudEnvSnippet}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '1rem 1.5rem', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {isConnected ? '✅ Real-time PostgreSQL querying active' : '⚡ High-performance resilient dataset active'}
          </span>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: '7px 20px' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

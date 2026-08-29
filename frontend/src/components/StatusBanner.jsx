import React from 'react';
import { Database, Info, CheckCircle2 } from 'lucide-react';

export function StatusBanner({ dbStatus }) {
  if (!dbStatus) return null;

  const isConnected = dbStatus.connected;

  return (
    <div className="status-banner">
      <div className="banner-content">
        <div className="banner-icon">
          {isConnected ? <CheckCircle2 size={20} color="#34d399" /> : <Info size={20} color="#818cf8" />}
        </div>
        <div>
          <div className="banner-title">
            {isConnected
              ? `Connected to PostgreSQL: ${dbStatus.database} (${dbStatus.host}:${dbStatus.port})`
              : `Running with Resilient In-Memory Storage`}
          </div>
          <div className="banner-desc">
            {isConnected
              ? 'All CRUD operations are directly persisted to your PostgreSQL database table `users`.'
              : 'PostgreSQL service is currently offline on port 5432. The app is fully operational with memory store. You can configure .env anytime.'}
          </div>
        </div>
      </div>
      <div className="banner-badge">
        Port: {dbStatus.port || 5432}
      </div>
    </div>
  );
}

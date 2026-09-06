import React from 'react';
import { Box, RefreshCw, Key, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Navbar({ health, isAnalyzing, onReset, hasResult }) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <Box className="brand-icon" />
        <span>AI Project Analyzer</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Health / API Key Status Badge */}
        {health && (
          <div className="nav-status">
            {health.status === 'ok' ? (
              health.apiKeyConfigured ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.8rem' }}>
                  <ShieldCheck size={16} /> API Key Configured
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontSize: '0.8rem' }}>
                  <ShieldAlert size={16} /> API Key Missing in .env
                </span>
              )
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.8rem' }}>
                <span className="status-dot warning" /> Backend Offline
              </span>
            )}
          </div>
        )}

        {hasResult && !isAnalyzing && (
          <button className="btn btn-secondary" onClick={onReset}>
            <RefreshCw size={16} /> New Analysis
          </button>
        )}
      </div>
    </header>
  );
}

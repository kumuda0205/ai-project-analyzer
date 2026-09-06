import React from 'react';
import { AppWindow, Layers, Database, Code2, Wrench, CheckCircle } from 'lucide-react';

export default function OverviewTab({ overview }) {
  if (!overview) return <p>No overview data available.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero Summary Card */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              {overview.projectName || 'Software Project'}
            </h2>
            <span className="badge badge-improvement" style={{ marginBottom: '0.75rem' }}>
              {overview.projectType || 'Full-Stack Application'}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginTop: '0.75rem', lineHeight: '1.6' }}>
          {overview.summary}
        </p>

        {overview.mainPurpose && (
          <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'var(--bg-main)', borderRadius: '6px' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Core Application Purpose:</strong>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {overview.mainPurpose}
            </p>
          </div>
        )}
      </div>

      {/* Grid of Key Properties */}
      <div className="grid-3">
        <div className="card">
          <div className="card-title">
            <Code2 size={18} style={{ color: '#3b82f6' }} /> Core Languages
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {overview.languages && overview.languages.length > 0 ? (
              overview.languages.map((lang, i) => (
                <span key={i} className="badge" style={{ background: '#1e293b', color: '#f9fafb' }}>
                  {lang}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Not detected</span>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <Layers size={18} style={{ color: '#10b981' }} /> Frameworks & Libraries
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {overview.frameworks && overview.frameworks.length > 0 ? (
              overview.frameworks.map((fw, i) => (
                <span key={i} className="badge" style={{ background: '#1e293b', color: '#10b981' }}>
                  {fw}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Not detected</span>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <Database size={18} style={{ color: '#f59e0b' }} /> Database & Storage
          </div>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
            {overview.database || 'None detected'}
          </p>
        </div>
      </div>

      {/* Major Features */}
      {overview.majorFeatures && overview.majorFeatures.length > 0 && (
        <div className="card">
          <div className="card-title">
            <CheckCircle size={18} style={{ color: 'var(--success)' }} /> Detected Features
          </div>
          <div className="grid-2" style={{ marginTop: '0.75rem' }}>
            {overview.majorFeatures.map((feat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

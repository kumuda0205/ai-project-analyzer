import React from 'react';
import { FileCode, AlertCircle, CheckCircle2, Box } from 'lucide-react';

export default function CodeAnalysisTab({ modules }) {
  if (!modules || !Array.isArray(modules) || modules.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>No individual file module analysis available.</p>;
  }

  const getMaintainabilityBadge = (score) => {
    switch (score?.toLowerCase()) {
      case 'good':
        return <span className="badge badge-improvement">Good Maintainability</span>;
      case 'fair':
        return <span className="badge badge-warning">Fair Maintainability</span>;
      case 'needs improvement':
        return <span className="badge badge-critical">Needs Improvement</span>;
      default:
        return <span className="badge" style={{ background: '#1e293b' }}>{score || 'Standard'}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {modules.map((mod, idx) => (
        <div key={idx} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCode size={20} style={{ color: 'var(--accent-blue)' }} />
              <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {mod.filePath}
              </span>
            </div>
            {getMaintainabilityBadge(mod.maintainabilityScore)}
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {mod.purpose}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {/* Exports */}
            {mod.keyExports && mod.keyExports.length > 0 && (
              <div style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '6px' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Key Exports / Functions:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                  {mod.keyExports.map((exp, i) => (
                    <span key={i} className="font-mono" style={{ fontSize: '0.75rem', background: '#1f2937', color: '#60a5fa', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dependencies */}
            {mod.dependencies && mod.dependencies.length > 0 && (
              <div style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '6px' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Module Dependencies:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                  {mod.dependencies.map((dep, i) => (
                    <span key={i} className="font-mono" style={{ fontSize: '0.75rem', background: '#1f2937', color: '#9ca3af', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Observations & Potential Issues */}
          {mod.qualityObservations && (
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong>Quality Observation:</strong> {mod.qualityObservations}
            </div>
          )}

          {mod.potentialIssues && mod.potentialIssues.length > 0 && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px', borderLeft: '3px solid var(--warning)' }}>
              <strong style={{ fontSize: '0.8rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <AlertCircle size={14} /> Potential Observations:
              </strong>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {mod.potentialIssues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

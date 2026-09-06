import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, Wrench } from 'lucide-react';

export default function IssuesTab({ issues }) {
  if (!issues || !Array.isArray(issues) || issues.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <CheckCircle2 size={44} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>No Critical Issues Detected</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          The static code analysis pipeline did not identify any major flaws or vulnerabilities in the inspected files.
        </p>
      </div>
    );
  }

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return (
          <span className="badge badge-critical" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertOctagon size={12} /> Critical
          </span>
        );
      case 'warning':
        return (
          <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertTriangle size={12} /> Warning
          </span>
        );
      default:
        return (
          <span className="badge badge-improvement" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Info size={12} /> Improvement
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {issues.map((issue, idx) => (
        <div key={idx} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {issue.title}
            </h3>
            {getSeverityBadge(issue.severity)}
          </div>

          {issue.affectedFile && (
            <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
              Affected File: {issue.affectedFile}
            </span>
          )}

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
            {issue.explanation}
          </p>

          {issue.impact && (
            <div style={{ marginBottom: '0.85rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Why it matters:</strong> {issue.impact}
            </div>
          )}

          {issue.suggestedFix && (
            <div
              style={{
                padding: '0.85rem 1rem',
                background: 'var(--bg-main)',
                borderRadius: '6px',
                borderLeft: '3px solid var(--accent-blue)',
                fontSize: '0.875rem',
              }}
            >
              <strong style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <Wrench size={14} /> Suggested Fix:
              </strong>
              <p style={{ color: 'var(--text-primary)' }}>{issue.suggestedFix}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

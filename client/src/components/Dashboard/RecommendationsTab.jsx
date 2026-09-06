import React from 'react';
import { Lightbulb, CheckSquare, Shield, Zap, Code, FileText } from 'lucide-react';

export default function RecommendationsTab({ recommendations }) {
  if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>No recommendations available.</p>;
  }

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'security':
        return <Shield size={18} style={{ color: 'var(--danger)' }} />;
      case 'performance':
        return <Zap size={18} style={{ color: 'var(--warning)' }} />;
      case 'code quality':
        return <Code size={18} style={{ color: 'var(--accent-blue)' }} />;
      case 'documentation':
        return <FileText size={18} style={{ color: 'var(--info)' }} />;
      default:
        return <Lightbulb size={18} style={{ color: '#f59e0b' }} />;
    }
  };

  return (
    <div className="grid-2">
      {recommendations.map((rec, idx) => (
        <div key={idx} className="card">
          <div className="card-title">
            {getCategoryIcon(rec.category)}
            <span>{rec.title}</span>
          </div>

          {rec.category && (
            <span className="badge" style={{ background: '#1e293b', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {rec.category}
            </span>
          )}

          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: '0.75rem 0', lineHeight: '1.5' }}>
            {rec.description}
          </p>

          {rec.evidence && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.65rem 0.85rem',
                background: 'var(--bg-main)',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
              }}
            >
              <strong style={{ color: 'var(--text-muted)' }}>Observed Evidence:</strong> {rec.evidence}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

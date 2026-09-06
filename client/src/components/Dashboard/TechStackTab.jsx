import React from 'react';
import { Layers, Terminal, Database, Wrench, Shield, CheckCircle } from 'lucide-react';

export default function TechStackTab({ techStack }) {
  if (!techStack || !Array.isArray(techStack) || techStack.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>No tech stack details detected.</p>;
  }

  // Group items by category
  const categories = techStack.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="grid-2">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="card">
            <div className="card-title">
              <Layers size={18} style={{ color: 'var(--accent-blue)' }} /> {category}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.75rem' }}>
              {items.map((tech, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-main)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {tech.name}
                    </span>
                    <span className="badge badge-improvement" style={{ fontSize: '0.7rem' }}>
                      Verified
                    </span>
                  </div>

                  {tech.detectionSource && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                      {tech.detectionSource}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

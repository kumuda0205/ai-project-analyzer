import React from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

const STAGES = [
  'Uploading project archive...',
  'Extracting files safely...',
  'Scanning project structure & filtering secrets...',
  'Selecting priority source files...',
  'Analyzing technology stack & entry points...',
  'Evaluating source code quality & architecture...',
  'Generating recommendations & viva questions...',
  'Finalizing project report...',
];

export default function ProgressModal({ activeStageIndex = 0 }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1.5rem',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Loader2
            size={40}
            className="animate-spin"
            style={{
              color: 'var(--accent-blue)',
              marginBottom: '1rem',
              animation: 'spin 1s linear infinite',
            }}
          />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Analyzing Software Project</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Multi-stage static code analysis using Claude AI
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {STAGES.map((stage, idx) => {
            const isDone = idx < activeStageIndex;
            const isCurrent = idx === activeStageIndex;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  color: isCurrent
                    ? 'var(--text-primary)'
                    : isDone
                    ? 'var(--success)'
                    : 'var(--text-muted)',
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                ) : isCurrent ? (
                  <Loader2 size={18} style={{ color: 'var(--accent-blue)', flexShrink: 0, animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Circle size={18} style={{ color: 'var(--border-light)', flexShrink: 0 }} />
                )}
                <span>{stage}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

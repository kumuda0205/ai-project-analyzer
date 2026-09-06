import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    darkMode: true,
    background: '#111827',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b',
    tertiaryColor: '#1f2937',
    primaryTextColor: '#f9fafb',
    lineColor: '#6b7280',
  },
});

export default function MermaidDiagram({ chart }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    let isMounted = true;
    const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

    setError(false);
    containerRef.current.innerHTML = '';

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      })
      .catch((err) => {
        console.warn('[Mermaid Render Error]', err);
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error || !chart) {
    return (
      <div style={{ padding: '1rem', background: '#1e293b', borderRadius: '6px', fontSize: '0.85rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Flowchart Diagram:</p>
        <pre className="font-mono" style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)' }}>
          {chart || 'No diagram available.'}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        overflowX: 'auto',
        background: 'var(--bg-main)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
      }}
    />
  );
}

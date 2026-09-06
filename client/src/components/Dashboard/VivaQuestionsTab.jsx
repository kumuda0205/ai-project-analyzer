import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, FileCode, CheckCircle2 } from 'lucide-react';

export default function VivaQuestionsTab({ vivaQuestions }) {
  const [openItems, setOpenItems] = useState({});

  if (!vivaQuestions || !Array.isArray(vivaQuestions) || vivaQuestions.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>No viva interview questions generated.</p>;
  }

  const toggleItem = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all = {};
    vivaQuestions.forEach((q, idx) => {
      all[q.id || idx] = true;
    });
    setOpenItems(all);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={20} style={{ color: '#f59e0b' }} /> Project Viva & Interview Questions ({vivaQuestions.length} Questions)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Tailored technical interview questions derived directly from your codebase architecture and implementation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={expandAll}>
            Expand All
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={collapseAll}>
            Collapse All
          </button>
        </div>
      </div>

      <div>
        {vivaQuestions.map((q, idx) => {
          const key = q.id || idx;
          const isOpen = Boolean(openItems[key]);

          return (
            <div key={key} className="accordion-item">
              <button className="accordion-header" onClick={() => toggleItem(key)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 700, minWidth: '24px' }}>
                    Q{idx + 1}.
                  </span>
                  <span>{q.question}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {q.category && (
                    <span className="badge" style={{ background: '#1e293b', color: 'var(--text-secondary)', textTransform: 'none' }}>
                      {q.category}
                    </span>
                  )}
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {isOpen && (
                <div className="accordion-content">
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      <CheckCircle2 size={16} /> Suggested Technical Answer:
                    </strong>
                    <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                      {q.suggestedAnswer}
                    </p>
                  </div>

                  {q.relatedFile && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <FileCode size={14} />
                      <span>Related Source File: <code className="font-mono">{q.relatedFile}</code></span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

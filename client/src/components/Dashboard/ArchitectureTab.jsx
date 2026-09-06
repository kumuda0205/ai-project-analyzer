import React from 'react';
import MermaidDiagram from '../MermaidDiagram';
import { Network, GitBranch, ArrowRight, HardDrive } from 'lucide-react';

export default function ArchitectureTab({ architecture }) {
  if (!architecture) return <p style={{ color: 'var(--text-muted)' }}>No architectural data available.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Mermaid Architectural Flow Diagram */}
      {architecture.mermaidDiagram && (
        <div className="card">
          <div className="card-title">
            <Network size={18} style={{ color: 'var(--accent-blue)' }} /> Visual Component & Data Flow Diagram
          </div>
          <MermaidDiagram chart={architecture.mermaidDiagram} />
        </div>
      )}

      {/* Summary & Components */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            <GitBranch size={18} style={{ color: '#10b981' }} /> Architectural Overview
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            {architecture.summary}
          </p>

          {architecture.components && architecture.components.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Major Architectural Components:</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {architecture.components.map((comp, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.6rem 0.85rem',
                      background: 'var(--bg-main)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      borderLeft: '3px solid var(--accent-blue)',
                    }}
                  >
                    {comp}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Data & Communication Flows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {architecture.dataFlow && (
            <div className="card">
              <div className="card-title">
                <ArrowRight size={18} style={{ color: '#f59e0b' }} /> Data Flow Strategy
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {architecture.dataFlow}
              </p>
            </div>
          )}

          {architecture.storageInteraction && (
            <div className="card">
              <div className="card-title">
                <HardDrive size={18} style={{ color: '#06b6d4' }} /> Storage & Persistence
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {architecture.storageInteraction}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Cpu, Shield, Layers, HelpCircle, FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-hero">
      <h1 className="landing-title">
        Intelligent Software Project Analysis Powered by Claude AI
      </h1>
      <p className="landing-subtitle">
        Upload any software project as a ZIP archive. Safely extract, scan, and evaluate tech stack, architecture, maintainability, bugs, and viva interview questions.
      </p>

      <div className="grid-3" style={{ marginTop: '2.5rem', textAlign: 'left' }}>
        <div className="card">
          <div className="card-title">
            <Cpu size={20} style={{ color: '#3b82f6' }} /> Multi-Stage AI Pipeline
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Combines metadata discovery, file module inspection, and holistic synthesis without exceeding LLM context budgets.
          </p>
        </div>

        <div className="card">
          <div className="card-title">
            <Shield size={20} style={{ color: '#10b981' }} /> Privacy & Secret Redaction
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Automatically redacts API keys, credentials, and excludes <code>.env</code> files. Temp files are deleted immediately after analysis.
          </p>
        </div>

        <div className="card">
          <div className="card-title">
            <HelpCircle size={20} style={{ color: '#f59e0b' }} /> Viva & Interview Prep
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Generates 15–20 project-specific viva questions with detailed technical answers based on your actual source code.
          </p>
        </div>
      </div>
    </div>
  );
}

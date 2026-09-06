import React, { useState } from 'react';
import { Copy, Download, Check, FileText } from 'lucide-react';

export default function DocumentationTab({ documentation }) {
  const [copied, setCopied] = useState(false);

  const markdownContent = documentation?.readmeMarkdown || '# No documentation generated.';

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} style={{ color: 'var(--accent-blue)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Generated Project Documentation (README.md)</h3>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Markdown'}
          </button>

          <button className="btn btn-primary" onClick={handleDownload}>
            <Download size={16} /> Download README.md
          </button>
        </div>
      </div>

      <div
        className="card font-mono"
        style={{
          whiteSpace: 'pre-wrap',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          color: 'var(--text-primary)',
          background: 'var(--bg-main)',
          maxHeight: '700px',
          overflowY: 'auto',
        }}
      >
        {markdownContent}
      </div>
    </div>
  );
}

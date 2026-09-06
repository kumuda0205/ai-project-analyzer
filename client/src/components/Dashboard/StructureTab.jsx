import React, { useState } from 'react';
import FileTreeNode from '../FileTreeNode';
import { FolderTree, FileCode, CheckCircle2 } from 'lucide-react';

export default function StructureTab({ structure, modules }) {
  const [selectedFile, setSelectedFile] = useState(null);

  if (!structure || structure.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>Project tree structure is unavailable.</p>;
  }

  // Find module explanation if present in AI analyzed modules
  const matchingModule = selectedFile
    ? modules?.find(
        (m) =>
          m.filePath === selectedFile.path ||
          m.filePath?.endsWith(selectedFile.name) ||
          selectedFile.path?.endsWith(m.filePath)
      )
    : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(360px, 1.2fr)', gap: '1.5rem' }}>
      {/* File Tree Explorer */}
      <div className="card">
        <div className="card-title">
          <FolderTree size={18} style={{ color: 'var(--accent-blue)' }} /> Project File Tree
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Ignored files (node_modules, secrets, binaries) are automatically filtered out.
        </p>

        <div
          style={{
            maxHeight: '600px',
            overflowY: 'auto',
            background: 'var(--bg-main)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
          }}
        >
          {structure.map((node, idx) => (
            <FileTreeNode
              key={idx}
              node={node}
              onSelectFile={(file) => setSelectedFile(file)}
              selectedPath={selectedFile?.path}
            />
          ))}
        </div>
      </div>

      {/* Selected File Details Pane */}
      <div className="card">
        <div className="card-title">
          <FileCode size={18} style={{ color: '#10b981' }} /> File Inspector
        </div>

        {selectedFile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', background: 'var(--bg-main)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>File Path</span>
              <p className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {selectedFile.path}
              </p>
              {selectedFile.size > 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                  Size: {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              )}
            </div>

            {matchingModule ? (
              <>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Module Purpose:</strong>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                    {matchingModule.purpose}
                  </p>
                </div>

                {matchingModule.keyExports && matchingModule.keyExports.length > 0 && (
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Key Functions / Components:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                      {matchingModule.keyExports.map((exp, i) => (
                        <span key={i} className="badge" style={{ background: '#1e293b', color: '#3b82f6', textTransform: 'none' }}>
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {matchingModule.qualityObservations && (
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Quality Assessment:</strong>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                      {matchingModule.qualityObservations}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                This file is part of the project tree. Deep AI module inspection prioritized primary application entrypoints and core controllers.
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <FileCode size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.9rem' }}>Select a file in the tree to inspect details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from 'lucide-react';

export default function FileTreeNode({ node, onSelectFile, selectedPath }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!node) return null;

  const isDirectory = node.type === 'directory';
  const isSelected = selectedPath === node.path;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      if (onSelectFile) onSelectFile(node);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div style={{ marginLeft: node.path ? '1rem' : 0 }}>
      <div
        onClick={handleToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.5rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'transparent',
          color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
          fontWeight: isSelected ? 600 : 400,
        }}
      >
        {isDirectory ? (
          <>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {isOpen ? (
              <FolderOpen size={16} style={{ color: '#3b82f6' }} />
            ) : (
              <Folder size={16} style={{ color: '#3b82f6' }} />
            )}
          </>
        ) : (
          <>
            <span style={{ width: '14px' }} />
            <FileText size={16} style={{ color: 'var(--text-muted)' }} />
          </>
        )}

        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {node.name}
        </span>

        {!isDirectory && node.size > 0 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {formatSize(node.size)}
          </span>
        )}
      </div>

      {isDirectory && isOpen && node.children && node.children.length > 0 && (
        <div style={{ borderLeft: '1px solid var(--border-color)', marginLeft: '0.5rem' }}>
          {node.children.map((child, idx) => (
            <FileTreeNode
              key={child.path || idx}
              node={child}
              onSelectFile={onSelectFile}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

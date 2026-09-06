import React, { useState, useRef } from 'react';
import { UploadCloud, FileArchive, X, Play, Lock, AlertTriangle } from 'lucide-react';

export default function UploadSection({ onStartAnalysis, isAnalyzing, error }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setValidationError('');
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      setValidationError('Only .ZIP project archives are supported.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setValidationError('File size exceeds the 50MB maximum upload limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto 3rem', width: '100%' }}>
      {(error || validationError) && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.9rem',
          }}
        >
          <AlertTriangle size={18} />
          <span>{validationError || error}</span>
        </div>
      )}

      <div
        className={`upload-card ${dragActive ? 'dragging' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        {!selectedFile ? (
          <>
            <UploadCloud className="upload-icon" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Drag and drop your project ZIP file here
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              or click to browse your computer
            </p>
            <span className="btn btn-secondary" style={{ pointerEvents: 'none' }}>
              Select ZIP Archive
            </span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
              Supported format: .zip archive (up to 50MB)
            </p>
          </>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <FileArchive size={44} style={{ color: 'var(--accent-blue)', marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              {selectedFile.name}
            </h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {formatFileSize(selectedFile.size)}
            </span>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => onStartAnalysis(selectedFile)}
                disabled={isAnalyzing}
              >
                <Play size={16} /> Start AI Analysis
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setSelectedFile(null)}
                disabled={isAnalyzing}
              >
                <X size={16} /> Remove
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="file-privacy-note" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Lock size={14} />
        <span>Privacy note: Uploaded archives are processed in temporary memory and permanently deleted immediately after analysis.</span>
      </div>
    </div>
  );
}

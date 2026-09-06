import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import UploadSection from './components/UploadSection';
import ProgressModal from './components/ProgressModal';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import { checkHealth, analyzeProjectZip } from './services/api';

export default function App() {
  const [health, setHealth] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [analysisReport, setAnalysisReport] = useState(null);
  const [error, setError] = useState('');

  // Fetch health status on mount
  useEffect(() => {
    checkHealth().then(setHealth);
  }, []);

  const handleStartAnalysis = async (file) => {
    setIsAnalyzing(true);
    setError('');
    setActiveStageIndex(0);

    // Simulate realistic progress stages while upload and multi-stage backend pipeline run
    const interval = setInterval(() => {
      setActiveStageIndex((prev) => {
        if (prev < 6) return prev + 1;
        return prev;
      });
    }, 2800);

    try {
      const data = await analyzeProjectZip(file);
      setActiveStageIndex(7);
      setTimeout(() => {
        setAnalysisReport(data);
        setIsAnalyzing(false);
      }, 600);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please check backend configuration.');
      setIsAnalyzing(false);
    } finally {
      clearInterval(interval);
    }
  };

  const handleReset = () => {
    setAnalysisReport(null);
    setError('');
    setActiveStageIndex(0);
  };

  return (
    <div className="app-container">
      <Navbar
        health={health}
        isAnalyzing={isAnalyzing}
        onReset={handleReset}
        hasResult={Boolean(analysisReport)}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {isAnalyzing && <ProgressModal activeStageIndex={activeStageIndex} />}

        {!analysisReport ? (
          <>
            <LandingPage />
            <UploadSection
              onStartAnalysis={handleStartAnalysis}
              isAnalyzing={isAnalyzing}
              error={error}
            />
          </>
        ) : (
          <DashboardLayout report={analysisReport} />
        )}
      </main>

      <footer
        style={{
          textAlign: 'center',
          padding: '1.25rem',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginTop: 'auto',
        }}
      >
        AI Project Analyzer &copy; {new Date().getFullYear()} &bull; Built with React, Express & Anthropic Claude API
      </footer>
    </div>
  );
}

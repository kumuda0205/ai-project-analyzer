import React, { useState } from 'react';
import OverviewTab from './OverviewTab';
import TechStackTab from './TechStackTab';
import StructureTab from './StructureTab';
import ArchitectureTab from './ArchitectureTab';
import CodeAnalysisTab from './CodeAnalysisTab';
import IssuesTab from './IssuesTab';
import RecommendationsTab from './RecommendationsTab';
import DocumentationTab from './DocumentationTab';
import VivaQuestionsTab from './VivaQuestionsTab';
import {
  LayoutDashboard,
  Layers,
  Network,
  FolderTree,
  FileCode,
  AlertTriangle,
  Lightbulb,
  FileText,
  HelpCircle,
} from 'lucide-react';

export default function DashboardLayout({ report }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!report) return null;

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'techStack', label: 'Tech Stack', icon: Layers },
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'structure', label: 'Project Structure', icon: FolderTree },
    { id: 'codeAnalysis', label: 'Code Analysis', icon: FileCode },
    { id: 'issues', label: 'Issues', icon: AlertTriangle, count: report.issues?.length },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'documentation', label: 'Documentation', icon: FileText },
    { id: 'vivaQuestions', label: 'Viva Questions', icon: HelpCircle, count: report.vivaQuestions?.length },
  ];

  return (
    <div className="dashboard-container">
      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '9999px',
                    background: tab.id === 'issues' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: tab.id === 'issues' ? '#ef4444' : '#3b82f6',
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div style={{ flex: 1 }}>
        {activeTab === 'overview' && <OverviewTab overview={report.overview} />}
        {activeTab === 'techStack' && <TechStackTab techStack={report.techStack} />}
        {activeTab === 'architecture' && <ArchitectureTab architecture={report.architecture} />}
        {activeTab === 'structure' && (
          <StructureTab structure={report.structure} modules={report.modules} />
        )}
        {activeTab === 'codeAnalysis' && <CodeAnalysisTab modules={report.modules} />}
        {activeTab === 'issues' && <IssuesTab issues={report.issues} />}
        {activeTab === 'recommendations' && (
          <RecommendationsTab recommendations={report.recommendations} />
        )}
        {activeTab === 'documentation' && (
          <DocumentationTab documentation={report.documentation} />
        )}
        {activeTab === 'vivaQuestions' && (
          <VivaQuestionsTab vivaQuestions={report.vivaQuestions} />
        )}
      </div>
    </div>
  );
}

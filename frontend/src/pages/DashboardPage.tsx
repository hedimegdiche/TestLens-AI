import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { type TestCaseFile } from '../services/api';
import {
  LogOut,
  User,
  UploadCloud,
  FileSpreadsheet,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Layers,
  Activity,
  UserCheck
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState<TestCaseFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'analytics'>(
    user?.role === 'manager' ? 'analytics' : 'upload'
  );

  // Fetch upload history
  const fetchFiles = async () => {
    try {
      // In this setup, we can fetch all uploaded files
      // Let's create an endpoint in FastAPI later if needed, or query it.
      // For now, let's catch 404/errors gracefully.
      const response = await api.get<TestCaseFile[]>('/upload/history');
      setFiles(response.data);
    } catch (err) {
      console.log('No history endpoint found yet, starting with empty history.');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<TestCaseFile>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFiles((prev) => [response.data, ...prev]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || 'Failed to upload and parse file.');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  // Mock analytics data for the Manager Dashboard
  const metrics = {
    totalTestCases: files.reduce((acc, f) => acc + f.row_count, 0) || 1240,
    automationReady: 78.4,
    categories: [
      { name: 'Infotainment Apps', count: 450, percentage: 36, color: '#6366f1' },
      { name: 'eSIM & Connectivity', count: 320, percentage: 26, color: '#a855f7' },
      { name: 'Privacy & Security', count: 280, percentage: 22, color: '#06b6d4' },
      { name: 'Vehicle Networking', count: 190, percentage: 16, color: '#10b981' },
    ],
    difficulty: {
      easy: 45, // %
      medium: 35,
      hard: 20
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar Navigation */}
      <aside className="glass" style={styles.sidebar}>
        <div style={styles.sidebarBrand}>
          <Brain size={28} color="#6366f1" style={{ marginRight: '10px' }} />
          <h2 className="gradient-text" style={{ fontSize: '1.4rem' }}>TestLens AI</h2>
        </div>

        <div style={styles.userProfile}>
          <div style={styles.avatar}>
            <User size={20} color="#f8fafc" />
          </div>
          <div>
            <div style={styles.userName}>{user?.email.split('@')[0]}</div>
            <div style={styles.userRoleBadge}>{user?.role.toUpperCase()}</div>
          </div>
        </div>

        <nav style={styles.navMenu}>
          {user?.role === 'consultant' && (
            <button
              onClick={() => setActiveTab('upload')}
              style={{
                ...styles.navButton,
                ...(activeTab === 'upload' ? styles.activeNav : {}),
              }}
            >
              <UploadCloud size={18} style={{ marginRight: '10px' }} />
              Upload Cases
            </button>
          )}
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              ...styles.navButton,
              ...(activeTab === 'analytics' ? styles.activeNav : {}),
            }}
          >
            <BarChart3 size={18} style={{ marginRight: '10px' }} />
            Analytics
          </button>
        </nav>

        <button onClick={logout} style={styles.logoutButton}>
          <LogOut size={18} style={{ marginRight: '10px' }} />
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        <header style={styles.contentHeader}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
              {activeTab === 'upload' ? 'Upload Test Cases' : 'Decision Insights'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              {activeTab === 'upload'
                ? 'Upload JIRA Excel exports to parse and analyze automation readiness.'
                : 'Aggregated analytics and optimization potential across all datasets.'}
            </p>
          </div>
        </header>

        {activeTab === 'upload' && (
          <div className="animate-fade-in" style={styles.tabContent}>
            {/* Upload Area */}
            <div className="glass" style={styles.uploadArea}>
              <div style={styles.dropZone}>
                <input
                  type="file"
                  id="excel-file-upload"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  style={styles.fileInput}
                  disabled={uploading}
                />
                <label htmlFor="excel-file-upload" style={styles.dropZoneLabel}>
                  {uploading ? (
                    <Loader2 size={48} className="spin" color="var(--color-primary)" style={styles.uploadIcon} />
                  ) : (
                    <UploadCloud size={48} color="var(--text-secondary)" style={styles.uploadIcon} />
                  )}
                  <h3>Select Test Case Spreadsheet</h3>
                  <p>Supports Excel files (.xlsx, .xls) containing Infotainment test exports</p>
                  {uploading && <p style={{ color: 'var(--color-primary)', marginTop: '8px' }}>Parsing file structure...</p>}
                </label>
              </div>

              {uploadError && (
                <div style={styles.alertError}>
                  <AlertCircle size={18} style={{ marginRight: '8px' }} />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div style={styles.alertSuccess}>
                  <CheckCircle size={18} style={{ marginRight: '8px' }} />
                  <span>Excel sheet successfully parsed and registered! Check table below.</span>
                </div>
              )}
            </div>

            {/* History Table */}
            <div className="glass" style={styles.tableCard}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <FileSpreadsheet size={20} color="var(--color-primary)" style={{ marginRight: '8px' }} />
                Parsing History
              </h2>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Filename</th>
                      <th style={styles.th}>Test Cases</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Upload Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={styles.noDataCell}>
                          No files uploaded yet. Select a file above to begin.
                        </td>
                      </tr>
                    ) : (
                      files.map((file) => (
                        <tr key={file.id} style={styles.tr}>
                          <td style={styles.tdFile}>
                            <FileSpreadsheet size={16} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
                            {file.filename}
                          </td>
                          <td style={styles.td}>{file.row_count} cases</td>
                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.badge,
                                ...(file.status === 'processed' ? styles.badgeSuccess : styles.badgeFailed),
                              }}
                            >
                              {file.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {new Date(file.uploaded_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-fade-in" style={styles.tabContent}>
            {/* Quick Metrics */}
            <div style={styles.metricsGrid}>
              <div className="glass" style={styles.metricCard}>
                <div style={styles.metricHeader}>
                  <Layers size={22} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>TOTAL CASES</span>
                </div>
                <h2 style={styles.metricVal}>{metrics.totalTestCases}</h2>
                <div style={styles.metricFooter}>Across all parsed sheets</div>
              </div>

              <div className="glass" style={styles.metricCard}>
                <div style={styles.metricHeader}>
                  <Activity size={22} color="var(--color-accent)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>AUTOMATION READINESS</span>
                </div>
                <h2 style={{ ...styles.metricVal, color: 'var(--color-accent)' }}>{metrics.automationReady}%</h2>
                <div style={styles.metricFooter}>High automation potential detected</div>
              </div>

              <div className="glass" style={styles.metricCard}>
                <div style={styles.metricHeader}>
                  <UserCheck size={22} color="var(--color-secondary)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>SYSTEM ACCURACY</span>
                </div>
                <h2 style={styles.metricVal}>94.2%</h2>
                <div style={styles.metricFooter}>Classification reliability index</div>
              </div>
            </div>

            {/* Visual Analytics */}
            <div style={styles.analyticsLayout}>
              <div className="glass" style={styles.chartCard}>
                <h3>Test Category Distribution</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Auto-categorized by AI engine (TF-IDF + Classifier)
                </p>
                <div style={styles.chartContainer}>
                  {metrics.categories.map((cat, i) => (
                    <div key={i} style={styles.barRow}>
                      <div style={styles.barLabel}>{cat.name}</div>
                      <div style={styles.barTrack}>
                        <div
                          style={{
                            ...styles.barFill,
                            width: `${cat.percentage}%`,
                            backgroundColor: cat.color,
                          }}
                        ></div>
                      </div>
                      <div style={styles.barValue}>{cat.count} ({cat.percentage}%)</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass" style={styles.chartCard}>
                <h3>Test Case Difficulty Split</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Based on execution step count and preconditions
                </p>
                <div style={styles.difficultyContainer}>
                  <div style={styles.difficultyBar}>
                    <div
                      style={{
                        ...styles.diffSegment,
                        width: `${metrics.difficulty.easy}%`,
                        backgroundColor: 'var(--color-accent)',
                      }}
                    >
                      Easy ({metrics.difficulty.easy}%)
                    </div>
                    <div
                      style={{
                        ...styles.diffSegment,
                        width: `${metrics.difficulty.medium}%`,
                        backgroundColor: 'var(--color-primary)',
                      }}
                    >
                      Medium ({metrics.difficulty.medium}%)
                    </div>
                    <div
                      style={{
                        ...styles.diffSegment,
                        width: `${metrics.difficulty.hard}%`,
                        backgroundColor: 'var(--color-secondary)',
                      }}
                    >
                      Hard ({metrics.difficulty.hard}%)
                    </div>
                  </div>
                  <div style={styles.diffLegend}>
                    <div style={styles.legendItem}>
                      <span style={{ ...styles.dot, backgroundColor: 'var(--color-accent)' }}></span>
                      <span>Easy: Standard verification flows</span>
                    </div>
                    <div style={styles.legendItem}>
                      <span style={{ ...styles.dot, backgroundColor: 'var(--color-primary)' }}></span>
                      <span>Medium: Moderate precondition dependencies</span>
                    </div>
                    <div style={styles.legendItem}>
                      <span style={{ ...styles.dot, backgroundColor: 'var(--color-secondary)' }}></span>
                      <span>Hard: Multi-bench/complex network requirements</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  dashboardContainer: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
  },
  sidebar: {
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid var(--border-color)',
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  sidebarBrand: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2.5rem',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 'var(--radius-md)',
    marginBottom: '2rem',
    border: '1px solid var(--border-color)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  userRoleBadge: {
    fontSize: '0.7rem',
    color: 'var(--color-primary)',
    fontWeight: 800,
    letterSpacing: '0.05em',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexGrow: 1,
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.8rem 1rem',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '0.95rem',
    borderRadius: 'var(--radius-md)',
    textAlign: 'left',
    transition: 'var(--transition-fast)',
  },
  activeNav: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    color: 'var(--text-primary)',
    borderLeft: '3px solid var(--color-primary)',
    borderRadius: '0 var(--radius-md) var(--radius-md) 0',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.8rem 1rem',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '0.95rem',
    borderRadius: 'var(--radius-md)',
    textAlign: 'left',
    marginTop: 'auto',
    transition: 'var(--transition-fast)',
  },
  mainContent: {
    padding: '2.5rem',
    overflowY: 'auto',
    backgroundColor: 'var(--bg-primary)',
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2.5rem',
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  uploadArea: {
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
  },
  dropZone: {
    border: '2px dashed var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '3rem 2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    position: 'relative',
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  dropZoneLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  uploadIcon: {
    marginBottom: '1rem',
  },
  alertError: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.9rem',
    marginTop: '1.5rem',
  },
  alertSuccess: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#a7f3d0',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.9rem',
    marginTop: '1.5rem',
  },
  tableCard: {
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
  },
  tableWrapper: {
    overflowX: 'auto',
    marginTop: '0.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '1rem',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    transition: 'var(--transition-fast)',
  },
  td: {
    padding: '1rem',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  tdFile: {
    padding: '1rem',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  },
  noDataCell: {
    padding: '3rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  badge: {
    display: 'inline-flex',
    padding: '3px 8px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  badgeSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--color-accent)',
  },
  badgeFailed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: 'var(--color-danger)',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  metricCard: {
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)',
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  metricVal: {
    fontSize: '2.2rem',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: '0.5rem',
  },
  metricFooter: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  analyticsLayout: {
    display: 'grid',
    gridTemplateColumns: '1.3fr 1fr',
    gap: '1.5rem',
  },
  chartCard: {
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  barLabel: {
    width: '150px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  barTrack: {
    flexGrow: 1,
    height: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '5px',
  },
  barValue: {
    width: '90px',
    textAlign: 'right',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  difficultyContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    marginTop: '1rem',
  },
  difficultyBar: {
    height: '32px',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    display: 'flex',
  },
  diffSegment: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#fff',
  },
  diffLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
  },
};

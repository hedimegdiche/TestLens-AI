import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, UserCheck, AlertTriangle } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'consultant' | 'manager'>('consultant');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, role);
        setSuccessMsg('Account registered successfully! Please log in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      // Errors are handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const toggleTab = (loginTab: boolean) => {
    setIsLogin(loginTab);
    clearError();
    setSuccessMsg('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.glowBg}></div>
      <div className="glass animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <Shield size={32} color="#6366f1" />
          </div>
          <h1 className="gradient-text" style={styles.title}>TestLens AI</h1>
          <p style={styles.subtitle}>Intelligent Test Case Management & Automation</p>
        </div>

        <div style={styles.tabContainer}>
          <button
            onClick={() => toggleTab(true)}
            style={{
              ...styles.tabButton,
              ...(isLogin ? styles.activeTab : {}),
            }}
          >
            Login
          </button>
          <button
            onClick={() => toggleTab(false)}
            style={{
              ...styles.tabButton,
              ...(!isLogin ? styles.activeTab : {}),
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={styles.alert}>
            <AlertTriangle size={18} color="#ef4444" style={{ marginRight: '8px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ ...styles.alert, ...styles.successAlert }}>
            <UserCheck size={18} color="#10b981" style={{ marginRight: '8px', flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                required
                className="input-field"
                placeholder="you@infotainment.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                required
                minLength={6}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Role Selection</label>
              <div style={styles.roleContainer}>
                <button
                  type="button"
                  onClick={() => setRole('consultant')}
                  style={{
                    ...styles.roleButton,
                    ...(role === 'consultant' ? styles.activeRole : {}),
                  }}
                >
                  <h3>Consultant</h3>
                  <p>Upload test sheets & analyze automation readiness</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('manager')}
                  style={{
                    ...styles.roleButton,
                    ...(role === 'manager' ? styles.activeRole : {}),
                  }}
                >
                  <h3>Manager</h3>
                  <p>View aggregated dashboards & track productivity</p>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary glow-hover"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  glowBg: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(168,85,247,0.06) 60%, rgba(0,0,0,0) 100%)',
    filter: 'blur(40px)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    borderRadius: 'var(--radius-lg)',
    padding: '2.5rem',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logoContainer: {
    display: 'inline-flex',
    padding: '1rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 800,
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: '4px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '1.5rem',
    border: '1px solid var(--border-color)',
  },
  tabButton: {
    flex: 1,
    padding: '0.6rem',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '0.95rem',
    borderRadius: 'calc(var(--radius-md) - 2px)',
    transition: 'var(--transition-fast)',
  },
  activeTab: {
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-sm)',
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  successAlert: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#a7f3d0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  roleContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginTop: '0.25rem',
  },
  roleButton: {
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'var(--transition-fast)',
    color: 'var(--text-secondary)',
  },
  activeRole: {
    borderColor: 'var(--color-primary)',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    color: 'var(--text-primary)',
    boxShadow: '0 0 10px rgba(99, 102, 241, 0.1)',
  },
  submitBtn: {
    width: '100%',
    padding: '0.9rem',
    marginTop: '0.5rem',
  },
};

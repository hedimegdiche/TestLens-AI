import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { Loader2 } from 'lucide-react';

// Create a spin keyframe injection
const styleSheet = document.styleSheets[0] || document.head.appendChild(document.createElement('style')).sheet;
try {
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `, 0);
  styleSheet.insertRule(`
    .spin {
      animation: spin 1s linear infinite;
    }
  `, 0);
} catch (e) {
  // Silent catch if style injection fails on SSR or start
}

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        backgroundColor: '#080c14'
      }}>
        <Loader2 className="spin" size={48} color="#6366f1" />
        <p style={{ color: '#94a3b8', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600 }}>
          Loading TestLens AI Platform...
        </p>
      </div>
    );
  }

  return user ? <DashboardPage /> : <AuthPage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

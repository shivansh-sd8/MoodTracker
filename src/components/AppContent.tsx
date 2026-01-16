'use client';

import { useAuth } from '@/context/AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';

export default function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#2d5a4a',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <Login />;
}

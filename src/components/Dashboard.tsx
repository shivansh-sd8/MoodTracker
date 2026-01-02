import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MoodInput from './MoodInput';
import MoodChart from './MoodChart';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { username, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<'input' | 'chart'>('input');

  const handleMoodLogged = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <span className="logo-icon">🌱</span>
            </div>
            <div className="header-text">
              <h1>Mood Tracker</h1>
              <p className="header-subtitle">Track your emotional journey</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">{username?.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <span className="greeting">{getGreeting()}</span>
                <span className="username">{username}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <nav className="dashboard-nav">
          <div className="nav-container">
            <button
              className={`nav-btn ${activeTab === 'input' ? 'active' : ''}`}
              onClick={() => setActiveTab('input')}
            >
              <span className="nav-icon">✏️</span>
              <span className="nav-text">Log Mood</span>
            </button>
            <button
              className={`nav-btn ${activeTab === 'chart' ? 'active' : ''}`}
              onClick={() => setActiveTab('chart')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Year View</span>
            </button>
          </div>
        </nav>

        <div className="content-area">
          {activeTab === 'input' ? (
            <MoodInput onMoodLogged={handleMoodLogged} />
          ) : (
            <MoodChart refreshTrigger={refreshTrigger} />
          )}
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>Made with 💚 for your wellbeing</p>
      </footer>
    </div>
  );
};

export default Dashboard;

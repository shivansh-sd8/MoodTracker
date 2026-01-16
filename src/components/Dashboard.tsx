'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MoodInput from './MoodInput';
import MoodChart from './MoodChart';
import styles from './Dashboard.module.css';

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
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardBgShapes}>
        <div className={`${styles.shape} ${styles.shape1}`}></div>
        <div className={`${styles.shape} ${styles.shape2}`}></div>
        <div className={`${styles.shape} ${styles.shape3}`}></div>
      </div>

      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.logoContainer}>
              <span className={styles.logoIcon}>🌱</span>
            </div>
            <div className={styles.headerText}>
              <h1>Mood Tracker</h1>
              <p className={styles.headerSubtitle}>Track your emotional journey</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>{username?.charAt(0).toUpperCase()}</div>
              <div className={styles.userDetails}>
                <span className={styles.greeting}>{getGreeting()}</span>
                <span className={styles.username}>{username}</span>
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={logout}>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.dashboardMain}>
        <nav className={styles.dashboardNav}>
          <div className={styles.navContainer}>
            <button
              className={`${styles.navBtn} ${activeTab === 'input' ? styles.active : ''}`}
              onClick={() => setActiveTab('input')}
            >
              <span className={styles.navIcon}>✏️</span>
              <span className={styles.navText}>Log Mood</span>
            </button>
            <button
              className={`${styles.navBtn} ${activeTab === 'chart' ? styles.active : ''}`}
              onClick={() => setActiveTab('chart')}
            >
              <span className={styles.navIcon}>📊</span>
              <span className={styles.navText}>Year View</span>
            </button>
          </div>
        </nav>

        <div className={styles.contentArea}>
          {activeTab === 'input' ? (
            <MoodInput onMoodLogged={handleMoodLogged} />
          ) : (
            <MoodChart refreshTrigger={refreshTrigger} />
          )}
        </div>
      </main>

      <footer className={styles.dashboardFooter}>
        <p>Made with 💚 for your wellbeing</p>
      </footer>
    </div>
  );
};

export default Dashboard;

'use client';

import React, { useState, useEffect } from 'react';
import { moodApi } from '@/lib/api';
import styles from './MoodInput.module.css';

interface MoodOption {
  value: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

const moodOptions: MoodOption[] = [
  { value: 'A+', label: 'A+', emoji: '🌟', color: '#9c27b0', description: 'Positive core memory' },
  { value: 'A', label: 'A', emoji: '😄', color: '#4caf50', description: 'Very positive' },
  { value: 'B', label: 'B', emoji: '🙂', color: '#8bc34a', description: 'Positive' },
  { value: 'C', label: 'C', emoji: '😐', color: '#ffeb3b', description: 'Neutral' },
  { value: 'D', label: 'D', emoji: '😕', color: '#ff9800', description: 'Negative' },
  { value: 'F', label: 'F', emoji: '😢', color: '#f44336', description: 'Very negative' },
];

interface MoodInputProps {
  onMoodLogged: () => void;
}

const MoodInput: React.FC<MoodInputProps> = ({ onMoodLogged }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTodayMood();
  }, []);

  const fetchTodayMood = async () => {
    try {
      const response = await moodApi.getTodayMood();
      if (response.data.mood) {
        setTodayMood(response.data.mood.mood);
        setSelectedMood(response.data.mood.mood);
      }
    } catch (error) {
      console.error('Failed to fetch today mood', error);
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;

    setLoading(true);
    try {
      await moodApi.logMood(selectedMood);
      setTodayMood(selectedMood);
      setMessage(todayMood ? 'Mood updated!' : 'Mood logged!');
      onMoodLogged();
    } catch (error) {
      console.error('Failed to log mood', error);
      setMessage('Failed to log mood');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.moodInputContainer}>
      <div className={styles.moodInputCard}>
        <div className={styles.moodHeader}>
          <h2>How are you feeling today?</h2>
          <p className={styles.moodDate}>{today}</p>
        </div>

        <div className={styles.moodOptions}>
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              className={`${styles.moodOption} ${selectedMood === mood.value ? styles.selected : ''}`}
              onClick={() => handleMoodSelect(mood.value)}
              style={{
                '--mood-color': mood.color,
                '--mood-bg': `${mood.color}20`,
              } as React.CSSProperties}
            >
              <span className={styles.moodEmoji}>{mood.emoji}</span>
              <span className={styles.moodLabel}>{mood.label}</span>
              <span className={styles.moodDescription}>{mood.description}</span>
            </button>
          ))}
        </div>

        {todayMood && (
          <div className={styles.currentMood}>
            <span>Today&apos;s mood: </span>
            <strong>{moodOptions.find(m => m.value === todayMood)?.emoji} {todayMood}</strong>
          </div>
        )}

        <button
          className={styles.submitMoodBtn}
          onClick={handleSubmit}
          disabled={!selectedMood || loading}
        >
          {loading ? 'Saving...' : todayMood ? 'Update Mood' : 'Log Mood'}
        </button>

        {message && <div className={styles.moodMessage}>{message}</div>}
      </div>
    </div>
  );
};

export default MoodInput;

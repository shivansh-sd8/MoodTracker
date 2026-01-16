'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { moodApi, YearMoodData } from '@/lib/api';
import styles from './MoodChart.module.css';

const moodColors: Record<string, string> = {
  'A+': '#9c27b0',
  'A': '#4caf50',
  'B': '#8bc34a',
  'C': '#ffeb3b',
  'D': '#ff9800',
  'F': '#f44336',
};

const moodLabels: Record<string, string> = {
  'A+': 'Positive core memory',
  'A': 'Very positive',
  'B': 'Positive',
  'C': 'Neutral (or the positive offset the negative)',
  'D': 'Negative',
  'F': 'Very negative',
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MoodChartProps {
  refreshTrigger: number;
}

const MoodChart: React.FC<MoodChartProps> = ({ refreshTrigger }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<YearMoodData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchYearData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await moodApi.getYearMoods(year);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch year data', error);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchYearData();
  }, [fetchYearData, refreshTrigger]);

  const getDaysInMonth = (month: number, yr: number) => {
    return new Date(yr, month + 1, 0).getDate();
  };

  const formatDate = (yr: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${yr}-${m}-${d}`;
  };

  const getMoodTextColor = (mood: string) => {
    if (mood === 'C') return '#333';
    return '#fff';
  };

  return (
    <div className={styles.moodChartContainer}>
      <div className={styles.moodChartCard}>
        <div className={styles.chartHeader}>
          <h1>{year} Mood Tracker</h1>
          <div className={styles.yearNav}>
            <button className={styles.yearNavBtn} onClick={() => setYear(year - 1)}>
              ◀
            </button>
            <button className={styles.yearNavBtn} onClick={() => setYear(year + 1)}>
              ▶
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            <div className={styles.chartWrapper}>
              <table className={styles.moodTable}>
                <thead>
                  <tr>
                    <th className={styles.dayHeader}></th>
                    {months.map((month) => (
                      <th key={month} className={styles.monthHeader}>{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 31 }, (_, dayIndex) => {
                    const day = dayIndex + 1;
                    return (
                      <tr key={day}>
                        <td className={styles.dayLabel}>{day}</td>
                        {months.map((_, monthIndex) => {
                          const daysInMonth = getDaysInMonth(monthIndex, year);
                          const dateStr = formatDate(year, monthIndex, day);
                          const mood = data?.moods[dateStr];
                          const isValidDay = day <= daysInMonth;
                          
                          return (
                            <td
                              key={`${monthIndex}-${day}`}
                              className={`${styles.moodCell} ${!isValidDay ? styles.invalid : ''} ${mood ? styles.hasMood : ''}`}
                              style={isValidDay && mood ? { 
                                backgroundColor: moodColors[mood],
                                color: getMoodTextColor(mood)
                              } : {}}
                              title={isValidDay ? `${months[monthIndex]} ${day}: ${mood || 'No entry'}` : ''}
                            >
                              {isValidDay ? (mood || '') : ''}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={styles.legendSection}>
              <h3>Legend:</h3>
              <div className={styles.legendGrid}>
                {Object.entries(moodColors).map(([mood, color]) => (
                  <div key={mood} className={styles.legendItem}>
                    <div
                      className={styles.legendColor}
                      style={{ 
                        backgroundColor: color,
                        color: getMoodTextColor(mood)
                      }}
                    >
                      {mood}
                    </div>
                    <span className={styles.legendLabel}>{moodLabels[mood]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.statsSection}>
              <table className={styles.statsTable}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Days</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(moodColors).map(([mood, color]) => (
                    <tr key={mood}>
                      <td>
                        <span 
                          className={styles.statsMoodBadge}
                          style={{ 
                            backgroundColor: color,
                            color: getMoodTextColor(mood)
                          }}
                        >
                          {mood}
                        </span>
                      </td>
                      <td className={styles.statsDays}>{String(data?.stats[mood] || 0).padStart(3, '0')}</td>
                      <td className={styles.statsPercent}>
                        <div className={styles.percentBarContainer}>
                          <div 
                            className={styles.percentBar} 
                            style={{ 
                              width: `${Math.min(parseFloat(data?.percentages[mood] || '0'), 100)}%`,
                              backgroundColor: color
                            }}
                          />
                          <span>{data?.percentages[mood] || '0.00'}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.totalSection}>
              Total logged days: <strong>{data?.totalDays || 0}</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoodChart;

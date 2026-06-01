import React, { useEffect, useRef } from 'react';
import type { TestStats } from '../types';

interface ResultsScreenProps {
  stats: TestStats;
  onRetry: () => void;
}

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  color?: 'accent' | 'success' | 'danger' | 'default';
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, color = 'default', delay }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    setTimeout(() => el.classList.add('stat-card-visible'), delay);
  }, [delay]);

  return (
    <div ref={cardRef} className={`stat-card stat-card-${color}`}>
      <span className={`stat-card-value color-${color}`}>
        {value}
        {unit && <span className="stat-card-unit">{unit}</span>}
      </span>
      <span className="stat-card-label">{label}</span>
    </div>
  );
};

/** Simple WPM performance label */
function getPerformanceLabel(wpm: number): { label: string; emoji: string } {
  if (wpm >= 100) return { label: 'Legendary', emoji: '🏆' };
  if (wpm >= 80) return { label: 'Expert', emoji: '⚡' };
  if (wpm >= 60) return { label: 'Proficient', emoji: '🚀' };
  if (wpm >= 40) return { label: 'Intermediate', emoji: '💪' };
  if (wpm >= 20) return { label: 'Beginner', emoji: '📝' };
  return { label: 'Novice', emoji: '🌱' };
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ stats, onRetry }) => {
  const perf = getPerformanceLabel(stats.wpm);

  return (
    <div className="results-screen">
      {/* Header */}
      <div className="results-header">
        <span className="results-emoji">{perf.emoji}</span>
        <h2 className="results-title">Test Complete</h2>
        <span className="results-badge">{perf.label}</span>
      </div>

      {/* Main WPM highlight */}
      <div className="results-wpm-hero">
        <span className="results-wpm-number">{stats.wpm}</span>
        <span className="results-wpm-unit">WPM</span>
      </div>

      {/* Stats grid */}
      <div className="results-grid">
        <StatCard label="Accuracy" value={stats.accuracy} unit="%" color="accent" delay={100} />
        <StatCard label="Total Typed" value={stats.totalTyped} color="default" delay={200} />
        <StatCard label="Correct" value={stats.correctChars} color="success" delay={300} />
        <StatCard label="Incorrect" value={stats.incorrectChars} color="danger" delay={400} />
        <StatCard label="Duration" value={stats.timerOption} unit="s" color="default" delay={500} />
        <StatCard
          label="Char / Min"
          value={Math.round(stats.correctChars / (stats.timerOption / 60))}
          color="accent"
          delay={600}
        />
      </div>

      {/* Retry button */}
      <button className="retry-btn" onClick={onRetry}>
        <span className="retry-icon">↺</span>
        Try Again
      </button>
    </div>
  );
};

import React from 'react';
import { calculateWPM, calculateAccuracy } from '../utils/textGenerator';
import type { TimerOption } from '../types';

interface LiveStatsProps {
  correctCount: number;
  incorrectCount: number;
  timerOption: TimerOption;
  timeLeft: number;
}

export const LiveStats: React.FC<LiveStatsProps> = ({
  correctCount,
  incorrectCount,
  timerOption,
  timeLeft,
}) => {
  const elapsed = timerOption - timeLeft;
  const wpm = elapsed > 0 ? calculateWPM(correctCount, elapsed) : 0;
  const total = correctCount + incorrectCount;
  const accuracy = calculateAccuracy(correctCount, total);

  return (
    <div className="live-stats">
      <div className="live-stat">
        <span className="live-stat-value">{wpm}</span>
        <span className="live-stat-label">WPM</span>
      </div>
      <div className="live-stat-divider" />
      <div className="live-stat">
        <span className="live-stat-value">{accuracy}%</span>
        <span className="live-stat-label">ACC</span>
      </div>
      <div className="live-stat-divider" />
      <div className="live-stat">
        <span className="live-stat-value correct-color">{correctCount}</span>
        <span className="live-stat-label">Correct</span>
      </div>
      <div className="live-stat-divider" />
      <div className="live-stat">
        <span className="live-stat-value error-color">{incorrectCount}</span>
        <span className="live-stat-label">Errors</span>
      </div>
    </div>
  );
};

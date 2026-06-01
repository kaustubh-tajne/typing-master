import React from 'react';
import type { TimerOption } from '../types';

interface TimerProps {
  timeLeft: number;
  timerOption: TimerOption;
  isRunning: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, timerOption, isRunning }) => {
  const progress = timeLeft / timerOption;
  const isLow = timeLeft <= 10;

  // SVG circle for progress ring
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className={`timer-widget ${isLow && isRunning ? 'timer-low' : ''}`}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        {/* Background track */}
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth="4"
        />
        {/* Progress arc */}
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke={isLow && isRunning ? 'var(--danger)' : 'var(--accent)'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <span className={`timer-label ${isLow && isRunning ? 'timer-label-low' : ''}`}>
        {timeLeft}
      </span>
    </div>
  );
};

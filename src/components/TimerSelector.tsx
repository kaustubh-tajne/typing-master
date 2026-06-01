import React from 'react';
import type { TimerOption } from '../types';

interface TimerSelectorProps {
  selected: TimerOption;
  onChange: (t: TimerOption) => void;
  disabled: boolean;
}

const OPTIONS: TimerOption[] = [30, 60, 120];

export const TimerSelector: React.FC<TimerSelectorProps> = ({ selected, onChange, disabled }) => {
  return (
    <div className="timer-selector">
      {OPTIONS.map(opt => (
        <button
          key={opt}
          className={`timer-btn ${selected === opt ? 'active' : ''}`}
          onClick={() => onChange(opt)}
          disabled={disabled}
          aria-pressed={selected === opt}
        >
          {opt}s
        </button>
      ))}
    </div>
  );
};

import React from 'react';

interface DevModeToggleProps {
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled: boolean;
}

export const DevModeToggle: React.FC<DevModeToggleProps> = ({ enabled, onChange, disabled }) => {
  return (
    <label className={`dev-toggle ${disabled ? 'dev-toggle-disabled' : ''}`}>
      <span className="dev-toggle-label">
        <span className="dev-icon">{enabled ? '⚙️' : '💬'}</span>
        Developer Mode
      </span>
      <span
        role="switch"
        aria-checked={enabled}
        className={`toggle-track ${enabled ? 'toggle-on' : ''}`}
        onClick={() => !disabled && onChange(!enabled)}
      >
        <span className="toggle-thumb" />
      </span>
    </label>
  );
};

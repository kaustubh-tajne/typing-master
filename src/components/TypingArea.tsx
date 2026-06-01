import React, { useRef, useEffect } from 'react';
import type { CharacterData } from '../types';

interface TypingAreaProps {
  characters: CharacterData[];
  currentIndex: number;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  disabled: boolean;
  onClick: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  characters,
  currentIndex,
  onKeyDown,
  inputRef,
  disabled,
  onClick,
}) => {
  const currentCharRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to keep current character visible
  useEffect(() => {
    if (currentCharRef.current && containerRef.current) {
      const charEl = currentCharRef.current;
      const container = containerRef.current;
      const charTop = charEl.offsetTop;
      const containerHeight = container.clientHeight;
      const scrollTarget = charTop - containerHeight / 2;
      container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <div className="typing-area-wrapper" onClick={onClick}>
      {/* Hidden input to capture keyboard events */}
      <input
        ref={inputRef}
        className="typing-input-hidden"
        onKeyDown={onKeyDown}
        disabled={disabled}
        readOnly
        aria-label="Typing input — click here to focus and start typing"
      />

      <div
        ref={containerRef}
        className={`typing-display ${disabled ? 'typing-display-disabled' : ''}`}
        aria-live="polite"
      >
        {characters.map((charData, i) => {
          const isCurrent = i === currentIndex;
          return (
            <span
              key={i}
              ref={isCurrent ? currentCharRef : null}
              className={`char char-${charData.state} ${isCurrent ? 'char-cursor' : ''}`}
              aria-hidden="true"
            >
              {charData.char === ' ' ? '\u00A0' : charData.char}
            </span>
          );
        })}
      </div>

      {/* Click-to-focus overlay when idle */}
      {disabled ? null : (
        <div className="focus-hint">Click to focus and start typing</div>
      )}
    </div>
  );
};

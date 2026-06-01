import React, { useRef, useEffect } from 'react';
import type { CharacterData } from '../types';

interface TypingAreaProps {
  characters: CharacterData[];
  currentIndex: number;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onMobileInput: (char: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  disabled: boolean;
  onClick: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  characters,
  currentIndex,
  onKeyDown,
  onMobileInput,
  inputRef,
  disabled,
  onClick,
}) => {
  const currentCharRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevInputValueRef = useRef<string>('');

  // Handle mobile input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const prevValue = prevInputValueRef.current;

    if (newValue.length > prevValue.length) {
      // Characters added - extract and process each new character
      const addedChars = newValue.slice(prevValue.length);
      for (const char of addedChars) {
        onMobileInput(char);
      }
    } else if (newValue.length < prevValue.length) {
      // Characters removed (backspace)
      onMobileInput('\x08');
    }

    // Keep input short to avoid accumulation (trim to last 5 chars if over 20)
    if (newValue.length > 20) {
      const trimmed = newValue.slice(-5);
      e.target.value = trimmed;
      prevInputValueRef.current = trimmed;
    } else {
      prevInputValueRef.current = newValue;
    }
  };

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
        onChange={handleInputChange}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        inputMode="text"
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

import React, { useEffect } from 'react';
import { useTypingTest } from '../hooks/useTypingTest';
import { Timer } from '../components/Timer';
import { TimerSelector } from '../components/TimerSelector';
import { DevModeToggle } from '../components/DevModeToggle';
import { TypingArea } from '../components/TypingArea';
import { LiveStats } from '../components/LiveStats';
import { ResultsScreen } from '../components/ResultsScreen';

export const TypingTestPage: React.FC = () => {
  const {
    characters,
    currentIndex,
    phase,
    timeLeft,
    timerOption,
    devMode,
    stats,
    inputRef,
    handleKeyDown,
    handleMobileInput,
    setTimerOption,
    setDevMode,
    restart,
    focusInput,
    correctCount,
    incorrectCount,
  } = useTypingTest();

  // Focus the hidden input on mount
  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const isRunning = phase === 'running';
  const isFinished = phase === 'finished';

  return (
    <div className="page">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⌨</span>
          <span className="logo-text">TypeMaster</span>
        </div>

        <div className="header-controls">
          <TimerSelector
            selected={timerOption}
            onChange={setTimerOption}
            disabled={isRunning}
          />
          <DevModeToggle
            enabled={devMode}
            onChange={setDevMode}
            disabled={isRunning}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="main-content">
        {isFinished && stats ? (
          <ResultsScreen stats={stats} onRetry={restart} />
        ) : (
          <>
            {/* Timer + Live stats bar */}
            <div className="test-toolbar">
              <Timer
                timeLeft={timeLeft}
                timerOption={timerOption}
                isRunning={isRunning}
              />
              {isRunning && (
                <LiveStats
                  correctCount={correctCount}
                  incorrectCount={incorrectCount}
                  timerOption={timerOption}
                  timeLeft={timeLeft}
                />
              )}
              {!isRunning && phase === 'idle' && (
                <div className="idle-hint">
                  <span className="idle-hint-icon">🎯</span>
                  Start typing to begin the test
                </div>
              )}
            </div>

            {/* Typing area */}
            <TypingArea
              characters={characters}
              currentIndex={currentIndex}
              onKeyDown={handleKeyDown}
              onMobileInput={handleMobileInput}
              inputRef={inputRef}
              disabled={isFinished}
              onClick={focusInput}
            />

            {/* Restart button */}
            <div className="bottom-bar">
              <button
                className="restart-btn"
                onClick={restart}
                title="Restart test (new paragraph)"
              >
                ↺ New Test
              </button>
              {devMode && (
                <span className="dev-badge">⚙️ Developer Mode</span>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <span>Press <kbd>Backspace</kbd> to correct • Click text area to focus</span>
      </footer>
    </div>
  );
};

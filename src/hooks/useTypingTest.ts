import { useState, useEffect, useRef, useCallback } from 'react';
import type { CharacterData, TestStats, TestPhase, TimerOption } from '../types';
import { generateParagraph, calculateWPM, calculateAccuracy } from '../utils/textGenerator';

interface UseTypingTestReturn {
  characters: CharacterData[];
  currentIndex: number;
  phase: TestPhase;
  timeLeft: number;
  timerOption: TimerOption;
  devMode: boolean;
  stats: TestStats | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleMobileInput: (char: string) => void;
  setTimerOption: (t: TimerOption) => void;
  setDevMode: (v: boolean) => void;
  restart: () => void;
  focusInput: () => void;
  correctCount: number;
  incorrectCount: number;
}

export function useTypingTest(): UseTypingTestReturn {
  const [timerOption, setTimerOption] = useState<TimerOption>(60);
  const [devMode, setDevMode] = useState(false);
  const [paragraph, setParagraph] = useState(() => generateParagraph(false));
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<TestPhase>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [stats, setStats] = useState<TestStats | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build character array from paragraph
  useEffect(() => {
    const chars: CharacterData[] = paragraph.split('').map((char, i) => ({
      char,
      state: i === 0 ? 'current' : 'pending',
    }));
    setCharacters(chars);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setTimeLeft(timerOption);
    setPhase('idle');
    setStats(null);
  }, [paragraph, timerOption]);

  // Countdown timer
  useEffect(() => {
    if (phase === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const finishTest = useCallback(() => {
    setPhase('finished');

    setCharacters(prev => {
      const correct = prev.filter(c => c.state === 'correct').length;
      const incorrect = prev.filter(c => c.state === 'incorrect').length;
      const total = correct + incorrect;
      const elapsedSec = timerOption; // full duration

      setStats({
        wpm: calculateWPM(correct, elapsedSec),
        accuracy: calculateAccuracy(correct, total),
        totalTyped: total,
        correctChars: correct,
        incorrectChars: incorrect,
        timeElapsed: elapsedSec,
        timerOption,
      });

      return prev;
    });
  }, [timerOption, timeLeft, phase]);

  // Expose finishTest via ref to avoid stale closure in interval
  const finishTestRef = useRef(finishTest);
  finishTestRef.current = finishTest;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (phase === 'finished') return;

    // Ignore modifier keys, tab, etc.
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === 'Tab' || e.key === 'Escape') return;

    if (e.key === 'Backspace') {
      if (currentIndex === 0) return;
      e.preventDefault();

      setCharacters(prev => {
        const updated = [...prev];
        const prevIdx = currentIndex - 1;
        // Undo stat
        if (updated[prevIdx].state === 'incorrect') {
          setIncorrectCount(c => Math.max(0, c - 1));
        } else if (updated[prevIdx].state === 'correct') {
          setCorrectCount(c => Math.max(0, c - 1));
        }
        updated[prevIdx] = { ...updated[prevIdx], state: 'current' };
        if (currentIndex < updated.length) {
          updated[currentIndex] = { ...updated[currentIndex], state: 'pending' };
        }
        return updated;
      });
      setCurrentIndex(prev => prev - 1);
      return;
    }

    if (e.key.length !== 1) return;
    e.preventDefault();

    // Start timer on first key press
    if (phase === 'idle') {
      setPhase('running');
      startTimeRef.current = Date.now();
    }

    setCharacters(prev => {
      const updated = [...prev];
      const isCorrect = updated[currentIndex].char === e.key;

      if (isCorrect) setCorrectCount(c => c + 1);
      else setIncorrectCount(c => c + 1);

      updated[currentIndex] = {
        ...updated[currentIndex],
        state: isCorrect ? 'correct' : 'incorrect',
      };

      const nextIdx = currentIndex + 1;
      if (nextIdx < updated.length) {
        updated[nextIdx] = { ...updated[nextIdx], state: 'current' };
      }

      return updated;
    });

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    // End if we typed all characters
    if (nextIndex >= paragraph.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => finishTestRef.current(), 50);
    }
  }, [phase, currentIndex, paragraph.length]);

  const handleMobileInput = useCallback((char: string) => {
    if (phase === 'finished') return;

    if (char === '\x08') {
      // Backspace
      if (currentIndex === 0) return;

      setCharacters(prev => {
        const updated = [...prev];
        const prevIdx = currentIndex - 1;
        // Undo stat
        if (updated[prevIdx].state === 'incorrect') {
          setIncorrectCount(c => Math.max(0, c - 1));
        } else if (updated[prevIdx].state === 'correct') {
          setCorrectCount(c => Math.max(0, c - 1));
        }
        updated[prevIdx] = { ...updated[prevIdx], state: 'current' };
        if (currentIndex < updated.length) {
          updated[currentIndex] = { ...updated[currentIndex], state: 'pending' };
        }
        return updated;
      });
      setCurrentIndex(prev => prev - 1);
      return;
    }

    // Regular character input
    // Start timer on first key press
    if (phase === 'idle') {
      setPhase('running');
      startTimeRef.current = Date.now();
    }

    setCharacters(prev => {
      const updated = [...prev];
      const isCorrect = updated[currentIndex].char === char;

      if (isCorrect) setCorrectCount(c => c + 1);
      else setIncorrectCount(c => c + 1);

      updated[currentIndex] = {
        ...updated[currentIndex],
        state: isCorrect ? 'correct' : 'incorrect',
      };

      const nextIdx = currentIndex + 1;
      if (nextIdx < updated.length) {
        updated[nextIdx] = { ...updated[nextIdx], state: 'current' };
      }

      return updated;
    });

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    // End if we typed all characters
    if (nextIndex >= paragraph.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => finishTestRef.current(), 50);
    }
  }, [phase, currentIndex, paragraph.length]);

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setParagraph(generateParagraph(devMode));
  }, [devMode]);

  const handleSetDevMode = useCallback((val: boolean) => {
    setDevMode(val);
    if (timerRef.current) clearInterval(timerRef.current);
    setParagraph(generateParagraph(val));
  }, []);

  const handleSetTimerOption = useCallback((t: TimerOption) => {
    setTimerOption(t);
    if (timerRef.current) clearInterval(timerRef.current);
    setParagraph(generateParagraph(devMode));
  }, [devMode]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return {
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
    setTimerOption: handleSetTimerOption,
    setDevMode: handleSetDevMode,
    restart,
    focusInput,
    correctCount,
    incorrectCount,
  };
}

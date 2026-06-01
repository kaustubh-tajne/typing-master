// Core typing test types

export type TimerOption = 30 | 60 | 120;

export type CharacterState = 'pending' | 'correct' | 'incorrect' | 'current';

export interface CharacterData {
  char: string;
  state: CharacterState;
}

export interface TestStats {
  wpm: number;
  accuracy: number;
  totalTyped: number;
  correctChars: number;
  incorrectChars: number;
  timeElapsed: number;
  timerOption: TimerOption;
}

export type TestPhase = 'idle' | 'running' | 'finished';

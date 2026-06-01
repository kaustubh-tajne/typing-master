import {
  subjects, verbs, adjectives, objects, adverbs,
  devWords, devSentenceTemplates
} from '../data/wordData';

/** Pick a random element from an array */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Capitalize first letter of a string */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Generate a single meaningful sentence */
function generateSentence(): string {
  const pattern = Math.floor(Math.random() * 5);
  let sentence: string;

  switch (pattern) {
    case 0:
      // "The developer builds scalable web applications."
      sentence = `The ${pick(subjects)} ${pick(verbs)} ${pick(adjectives)} ${pick(objects)}.`;
      break;
    case 1:
      // "The engineer optimizes distributed systems efficiently."
      sentence = `The ${pick(subjects)} ${pick(verbs)} ${pick(objects)} ${pick(adverbs)}.`;
      break;
    case 2:
      // "A scalable algorithm improves backend services."
      sentence = `A ${pick(adjectives)} ${pick(subjects)} ${pick(verbs)} ${pick(objects)}.`;
      break;
    case 3:
      // "The system analyzes and optimizes cloud infrastructure."
      sentence = `The ${pick(subjects)} ${pick(verbs)} and ${pick(verbs)} ${pick(objects)}.`;
      break;
    default:
      // "Every developer designs robust microservices."
      sentence = `Every ${pick(subjects)} ${pick(verbs)} ${pick(adjectives)} ${pick(objects)}.`;
  }

  return capitalize(sentence);
}

/** Generate developer-mode text using tech words */
function generateDevSentence(): string {
  const template = pick(devSentenceTemplates);
  const wordA = pick(devWords);
  let wordB = pick(devWords);
  // Ensure A and B are different
  while (wordB === wordA) wordB = pick(devWords);

  return template.replace('{A}', wordA).replace('{B}', wordB);
}

/** Generate a full typing test paragraph */
export function generateParagraph(devMode: boolean = false): string {
  const count = Math.floor(Math.random() * 8) + 8; // 8–15 sentences
  const sentences: string[] = [];

  for (let i = 0; i < count; i++) {
    sentences.push(devMode ? generateDevSentence() : generateSentence());
  }

  return sentences.join(' ');
}

/** Calculate WPM (words per minute) */
export function calculateWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds === 0) return 0;
  // Standard: 5 chars = 1 word
  const words = correctChars / 5;
  const minutes = elapsedSeconds / 60;
  return Math.round(words / minutes);
}

/** Calculate accuracy percentage */
export function calculateAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
}

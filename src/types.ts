export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type Level = (typeof LEVELS)[number];
export type Article = 'der' | 'die' | 'das';
export type VocabularyMode = 'level' | 'up-to';
export type Theme = 'system' | 'light' | 'dark';

export interface Noun {
  id: string;
  noun: string;
  article: Article;
  english: string;
  plural: string;
  level: Level;
}

export interface NounProgress {
  id: string;
  shown: number;
  correct: number;
  incorrect: number;
  consecutiveCorrect: number;
  lastPracticed: string;
  nextDue: string;
}

export interface AnswerRecord {
  id?: number;
  nounId: string;
  selected: Article;
  correct: boolean;
  practicedAt: string;
}

export interface Settings {
  level: Level;
  mode: VocabularyMode;
  theme: Theme;
  onboardingComplete: boolean;
}

export interface BackupData {
  version: 1;
  exportedAt: string;
  settings: Settings;
  progress: NounProgress[];
  history: AnswerRecord[];
}

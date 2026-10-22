import type { Article, Noun, NounProgress } from './types';

const DAY = 86_400_000;

export function applyAnswer(
  previous: NounProgress | undefined,
  nounId: string,
  selected: Article,
  correctArticle: Article,
  now = new Date(),
): NounProgress {
  const correct = selected === correctArticle;
  const consecutiveCorrect = correct ? (previous?.consecutiveCorrect ?? 0) + 1 : 0;
  const interval = correct ? [1, 3, 7, 21, 45][Math.min(consecutiveCorrect - 1, 4)] * DAY : 5 * 60_000;
  return {
    id: nounId,
    shown: (previous?.shown ?? 0) + 1,
    correct: (previous?.correct ?? 0) + Number(correct),
    incorrect: (previous?.incorrect ?? 0) + Number(!correct),
    consecutiveCorrect,
    lastPracticed: now.toISOString(),
    nextDue: new Date(now.getTime() + interval).toISOString(),
  };
}

export const isMastered = (item: NounProgress): boolean =>
  item.consecutiveCorrect >= 3 && item.correct / item.shown >= 0.8;

export const needsPractice = (item: NounProgress): boolean =>
  item.incorrect > 0 && !isMastered(item);

export interface SelectionOptions {
  now?: Date;
  recentIds?: string[];
  focusMistakes?: boolean;
  random?: () => number;
}

const choose = <T,>(items: T[], random: () => number): T | undefined =>
  items.length ? items[Math.floor(random() * items.length)] : undefined;

export function selectNextNoun(
  nouns: Noun[],
  progressList: NounProgress[],
  options: SelectionOptions = {},
): Noun | undefined {
  if (!nouns.length) return undefined;
  const now = (options.now ?? new Date()).getTime();
  const random = options.random ?? Math.random;
  const progress = new Map(progressList.map((item) => [item.id, item]));
  const recent = new Set(options.recentIds ?? []);
  const eligible = nouns.filter((noun) => !recent.has(noun.id));
  const pool = eligible.length ? eligible : nouns;
  const weak = pool.filter((noun) => {
    const item = progress.get(noun.id);
    return item && item.incorrect > 0 && !isMastered(item);
  });
  if (options.focusMistakes) return choose(weak, random);
  const due = pool.filter((noun) => {
    const item = progress.get(noun.id);
    return item && new Date(item.nextDue).getTime() <= now && !weak.includes(noun);
  });
  const fresh = pool.filter((noun) => !progress.has(noun.id));
  const practiced = pool.filter((noun) => progress.has(noun.id));
  const roll = random();
  const order = roll < 0.5 ? [weak, due, fresh, practiced] : roll < 0.8 ? [due, weak, fresh, practiced] : [fresh, weak, due, practiced];
  for (const category of order) {
    const item = choose(category, random);
    if (item) return item;
  }
  return choose(pool, random);
}

export function accuracy(correct: number, shown: number): number {
  return shown ? Math.round((correct / shown) * 100) : 0;
}

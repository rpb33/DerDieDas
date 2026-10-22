import { describe, expect, it } from 'vitest';
import { vocabulary } from './data/vocabulary';
import { applyAnswer, isMastered, selectNextNoun } from './learning';
import type { NounProgress } from './types';

describe('answer handling and review scheduling', () => {
  const now = new Date('2026-01-01T12:00:00.000Z');

  it('records a correct answer and schedules it one day later', () => {
    const result = applyAnswer(undefined, 'a1-hund', 'der', 'der', now);
    expect(result).toMatchObject({ shown: 1, correct: 1, incorrect: 0, consecutiveCorrect: 1 });
    expect(result.nextDue).toBe('2026-01-02T12:00:00.000Z');
  });

  it('records an incorrect answer, resets the streak, and makes review due soon', () => {
    const prior: NounProgress = { id: 'a1-hund', shown: 3, correct: 3, incorrect: 0, consecutiveCorrect: 3, lastPracticed: '', nextDue: '' };
    const result = applyAnswer(prior, 'a1-hund', 'die', 'der', now);
    expect(result).toMatchObject({ shown: 4, correct: 3, incorrect: 1, consecutiveCorrect: 0 });
    expect(result.nextDue).toBe('2026-01-01T12:05:00.000Z');
  });

  it('requires repeated accurate reviews for mastery', () => {
    expect(isMastered({ id: 'x', shown: 3, correct: 3, incorrect: 0, consecutiveCorrect: 3, lastPracticed: '', nextDue: '' })).toBe(true);
    expect(isMastered({ id: 'x', shown: 1, correct: 1, incorrect: 0, consecutiveCorrect: 1, lastPracticed: '', nextDue: '' })).toBe(false);
  });

  it('prioritizes a weak noun in the reinforcement portion of selection', () => {
    const pool = vocabulary.slice(0, 4);
    const weak: NounProgress = { id: pool[2].id, shown: 2, correct: 0, incorrect: 2, consecutiveCorrect: 0, lastPracticed: now.toISOString(), nextDue: now.toISOString() };
    expect(selectNextNoun(pool, [weak], { now, random: () => 0.1 })?.id).toBe(weak.id);
  });

  it('does not immediately repeat the recent noun when alternatives exist', () => {
    const pool = vocabulary.slice(0, 3);
    expect(selectNextNoun(pool, [], { recentIds: [pool[0].id], random: () => 0 })?.id).not.toBe(pool[0].id);
  });
});

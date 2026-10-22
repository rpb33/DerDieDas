import { describe, expect, it } from 'vitest';
import { filterVocabulary, vocabulary } from './vocabulary';
import { LEVELS } from '../types';

describe('vocabulary', () => {
  it('contains 40 complete, valid nouns per level and unique IDs', () => {
    expect(vocabulary).toHaveLength(240);
    expect(new Set(vocabulary.map((noun) => noun.id)).size).toBe(240);
    for (const level of LEVELS) expect(vocabulary.filter((noun) => noun.level === level)).toHaveLength(40);
    for (const noun of vocabulary) {
      expect(['der', 'die', 'das']).toContain(noun.article);
      expect(noun.id && noun.noun && noun.english && noun.plural && noun.level).toBeTruthy();
    }
  });

  it('finds the correct article for a known noun', () => {
    expect(vocabulary.find((noun) => noun.id === 'a1-hund')?.article).toBe('der');
  });

  it('filters one level or all levels up to it', () => {
    expect(filterVocabulary('B1', 'level')).toHaveLength(40);
    expect(filterVocabulary('B1', 'up-to')).toHaveLength(120);
    expect(new Set(filterVocabulary('B1', 'up-to').map((noun) => noun.level))).toEqual(new Set(['A1', 'A2', 'B1']));
  });
});

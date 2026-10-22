import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { applyAnswer } from './learning';
import { __deleteDatabaseForTests, defaultSettings, exportData, getAllProgress, getSettings, importData, saveAnswer, saveSettings } from './storage';

afterEach(() => __deleteDatabaseForTests());

describe('local progress persistence and backups', () => {
  it('persists settings and answer progress in IndexedDB', async () => {
    const settings = { ...defaultSettings, level: 'B2' as const, onboardingComplete: true };
    const progress = applyAnswer(undefined, 'a1-hund', 'der', 'der', new Date('2026-01-01T00:00:00Z'));
    await saveSettings(settings);
    await saveAnswer({ nounId: 'a1-hund', selected: 'der', correct: true, practicedAt: progress.lastPracticed }, progress);
    expect(await getSettings()).toEqual(settings);
    expect(await getAllProgress()).toEqual([progress]);
  });

  it('exports and imports a complete local backup', async () => {
    const progress = applyAnswer(undefined, 'a1-auto', 'der', 'das', new Date('2026-02-01T00:00:00Z'));
    await saveAnswer({ nounId: 'a1-auto', selected: 'der', correct: false, practicedAt: progress.lastPracticed }, progress);
    const backup = await exportData();
    expect(backup.version).toBe(1);
    expect(backup.history).toHaveLength(1);
    await __deleteDatabaseForTests();
    await importData(backup);
    expect(await getAllProgress()).toEqual([progress]);
    expect((await exportData()).history[0]).toMatchObject({ nounId: 'a1-auto', correct: false });
  });

  it('rejects malformed imports', async () => {
    await expect(importData({ version: 9 })).rejects.toThrow(/backup/i);
  });
});

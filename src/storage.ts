import type { AnswerRecord, BackupData, NounProgress, Settings } from './types';

const DB_NAME = 'der-die-das';
const DB_VERSION = 1;
const SETTINGS_KEY = 'settings';

export const defaultSettings: Settings = { level: 'A1', mode: 'level', theme: 'system', onboardingComplete: false };

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('progress')) db.createObjectStore('progress', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('history')) db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const requestResult = <T,>(request: IDBRequest<T>): Promise<T> => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const transactionDone = (transaction: IDBTransaction): Promise<void> => new Promise((resolve, reject) => {
  transaction.oncomplete = () => resolve();
  transaction.onerror = () => reject(transaction.error);
  transaction.onabort = () => reject(transaction.error);
});

export async function getSettings(): Promise<Settings> {
  const db = await openDatabase();
  const value = await requestResult(db.transaction('settings').objectStore('settings').get(SETTINGS_KEY));
  db.close();
  return { ...defaultSettings, ...(value as Partial<Settings> | undefined) };
}

export async function saveSettings(settings: Settings): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction('settings', 'readwrite');
  tx.objectStore('settings').put(settings, SETTINGS_KEY);
  await transactionDone(tx);
  db.close();
}

export async function getAllProgress(): Promise<NounProgress[]> {
  const db = await openDatabase();
  const result = await requestResult(db.transaction('progress').objectStore('progress').getAll());
  db.close();
  return result as NounProgress[];
}

export async function saveAnswer(record: AnswerRecord, progress: NounProgress): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(['progress', 'history'], 'readwrite');
  tx.objectStore('progress').put(progress);
  tx.objectStore('history').add(record);
  await transactionDone(tx);
  db.close();
}

export async function exportData(): Promise<BackupData> {
  const db = await openDatabase();
  const tx = db.transaction(['progress', 'history', 'settings']);
  const progressRequest = tx.objectStore('progress').getAll();
  const historyRequest = tx.objectStore('history').getAll();
  const settingsRequest = tx.objectStore('settings').get(SETTINGS_KEY);
  const [progress, history, settings] = await Promise.all([
    requestResult(progressRequest), requestResult(historyRequest), requestResult(settingsRequest),
  ]);
  db.close();
  return { version: 1, exportedAt: new Date().toISOString(), settings: { ...defaultSettings, ...(settings as Partial<Settings> | undefined) }, progress: progress as NounProgress[], history: history as AnswerRecord[] };
}

function assertBackup(value: unknown): asserts value is BackupData {
  if (!value || typeof value !== 'object') throw new Error('The selected file is not a valid backup.');
  const data = value as Partial<BackupData>;
  if (data.version !== 1 || !Array.isArray(data.progress) || !Array.isArray(data.history) || !data.settings) throw new Error('Unsupported or incomplete backup file.');
}

export async function importData(value: unknown): Promise<void> {
  assertBackup(value);
  const db = await openDatabase();
  const tx = db.transaction(['progress', 'history', 'settings'], 'readwrite');
  tx.objectStore('progress').clear();
  tx.objectStore('history').clear();
  for (const item of value.progress) tx.objectStore('progress').put(item);
  for (const item of value.history) {
    const { id: _id, ...record } = item;
    tx.objectStore('history').add(record);
  }
  tx.objectStore('settings').put({ ...defaultSettings, ...value.settings }, SETTINGS_KEY);
  await transactionDone(tx);
  db.close();
}

export async function resetData(): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(['progress', 'history'], 'readwrite');
  tx.objectStore('progress').clear();
  tx.objectStore('history').clear();
  await transactionDone(tx);
  db.close();
}

export function downloadBackup(data: BackupData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `der-die-das-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export const __deleteDatabaseForTests = (): Promise<void> => new Promise((resolve, reject) => {
  const request = indexedDB.deleteDatabase(DB_NAME);
  request.onsuccess = () => resolve();
  request.onerror = () => reject(request.error);
  request.onblocked = () => reject(new Error('Database deletion blocked'));
});

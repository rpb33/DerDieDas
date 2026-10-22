import { useEffect, useMemo, useRef, useState } from 'react';
import { filterVocabulary, vocabulary } from './data/vocabulary';
import { accuracy, applyAnswer, isMastered, needsPractice, selectNextNoun } from './learning';
import { defaultSettings, downloadBackup, exportData, getAllProgress, getSettings, importData, resetData, saveAnswer, saveSettings } from './storage';
import { LEVELS, type AnswerRecord, type Article, type Level, type Noun, type NounProgress, type Settings, type Theme, type VocabularyMode } from './types';

type Tab = 'practice' | 'progress' | 'settings';
const articles: Article[] = ['der', 'die', 'das'];
const levelNames: Record<Level, string> = { A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper-intermediate', C1: 'Advanced', C2: 'Proficient' };

export default function App() {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [progress, setProgress] = useState<NounProgress[]>([]);
  const [tab, setTab] = useState<Tab>('practice');
  const [current, setCurrent] = useState<Noun>();
  const [selected, setSelected] = useState<Article>();
  const [sessionCount, setSessionCount] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const [focusMistakes, setFocusMistakes] = useState(false);
  const [notice, setNotice] = useState('');
  const retryQueue = useRef<{ id: string; dueAt: number }[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const pool = useMemo(() => filterVocabulary(settings.level, settings.mode), [settings.level, settings.mode]);

  useEffect(() => {
    Promise.all([getSettings(), getAllProgress()]).then(([savedSettings, savedProgress]) => {
      setSettings(savedSettings);
      setProgress(savedProgress);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    if (!ready || !settings.onboardingComplete) return;
    setCurrent(selectNextNoun(pool, progress, { recentIds: recent.slice(-1), focusMistakes }));
    setSelected(undefined);
  // The level or mode changes the pool; progress is intentionally not a dependency here.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, settings.level, settings.mode, settings.onboardingComplete, focusMistakes]);

  const updateSettings = async (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    await saveSettings(next);
  };

  const answer = async (article: Article) => {
    if (!current || selected) return;
    setSelected(article);
    const old = progress.find((item) => item.id === current.id);
    const updated = applyAnswer(old, current.id, article, current.article);
    const record: AnswerRecord = { nounId: current.id, selected: article, correct: article === current.article, practicedAt: updated.lastPracticed };
    setProgress((items) => [...items.filter((item) => item.id !== current.id), updated]);
    setSessionCount((count) => count + 1);
    if (!record.correct) retryQueue.current.push({ id: current.id, dueAt: sessionCount + 4 });
    await saveAnswer(record, updated);
  };

  const nextWord = () => {
    if (!current) return;
    const nextRecent = [...recent, current.id].slice(-3);
    setRecent(nextRecent);
    const dueRetryIndex = retryQueue.current.findIndex((item) => item.dueAt <= sessionCount);
    let next: Noun | undefined;
    if (!focusMistakes && dueRetryIndex >= 0) {
      const [retry] = retryQueue.current.splice(dueRetryIndex, 1);
      next = pool.find((noun) => noun.id === retry.id && noun.id !== current.id);
    }
    next ??= selectNextNoun(pool, progress, { recentIds: nextRecent, focusMistakes });
    setCurrent(next);
    setSelected(undefined);
  };

  const startMistakes = () => {
    setFocusMistakes(true);
    setTab('practice');
  };

  const stopMistakes = () => setFocusMistakes(false);

  const handleExport = async () => {
    downloadBackup(await exportData());
    setNotice('Backup downloaded.');
  };

  const handleImport = async (file: File) => {
    try {
      await importData(JSON.parse(await file.text()));
      const [newSettings, newProgress] = await Promise.all([getSettings(), getAllProgress()]);
      setSettings(newSettings);
      setProgress(newProgress);
      setNotice('Progress imported successfully.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not import that backup.');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all learning progress? This cannot be undone unless you exported a backup.')) return;
    await resetData();
    setProgress([]);
    setSessionCount(0);
    retryQueue.current = [];
    setNotice('Learning progress reset.');
  };

  if (!ready) return <main className="center"><p>Loading your words…</p></main>;

  if (!settings.onboardingComplete) {
    return <main className="onboarding">
      <div className="brand-mark" aria-hidden="true">D³</div>
      <p className="eyebrow">DER · DIE · DAS</p>
      <h1>Choose your level</h1>
      <p className="lede">Pick a starting point. You can change this any time.</p>
      <div className="level-grid">
        {LEVELS.map((level) => <button key={level} className={`level-choice ${settings.level === level ? 'active' : ''}`} onClick={() => setSettings({ ...settings, level })}>
          <strong>{level}</strong><span>{levelNames[level]}</span>
        </button>)}
      </div>
      <button className="primary wide" onClick={() => updateSettings({ onboardingComplete: true })}>Start practicing <span>→</span></button>
      <p className="privacy-note">No account. Your progress stays on this device.</p>
    </main>;
  }

  return <div className="app-shell">
    <header className="topbar">
      <div><span className="mini-logo">D³</span><span className="wordmark">DerDieDas</span></div>
      <span className="session-pill">{sessionCount} this session</span>
    </header>

    <main className="content">
      {tab === 'practice' && <Practice current={current} selected={selected} level={settings.level} onAnswer={answer} onNext={nextWord} focusMistakes={focusMistakes} stopMistakes={stopMistakes} />}
      {tab === 'progress' && <Progress progress={progress} onPracticeMistakes={startMistakes} />}
      {tab === 'settings' && <SettingsView settings={settings} updateSettings={updateSettings} onExport={handleExport} onImport={() => fileInput.current?.click()} onReset={handleReset} notice={notice} />}
    </main>

    <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImport(file); event.target.value = ''; }} />
    <nav className="bottom-nav" aria-label="Main navigation">
      <NavButton active={tab === 'practice'} label="Practice" icon="cards" onClick={() => setTab('practice')} />
      <NavButton active={tab === 'progress'} label="Progress" icon="chart" onClick={() => setTab('progress')} />
      <NavButton active={tab === 'settings'} label="Settings" icon="gear" onClick={() => setTab('settings')} />
    </nav>
  </div>;
}

function Practice({ current, selected, level, onAnswer, onNext, focusMistakes, stopMistakes }: { current?: Noun; selected?: Article; level: Level; onAnswer: (article: Article) => void; onNext: () => void; focusMistakes: boolean; stopMistakes: () => void }) {
  if (!current) return <section className="empty-state"><div className="empty-icon">✓</div><h1>No mistakes to review</h1><p>Practice normally, and words you miss will appear here.</p><button className="primary" onClick={stopMistakes}>Back to all words</button></section>;
  const correct = selected === current.article;
  return <section className="practice-screen">
    <div className="practice-heading">
      <div><p className="eyebrow">{focusMistakes ? 'FOCUSED REVIEW' : 'CHOOSE THE CORRECT ARTICLE'}</p><h1>Which one fits?</h1></div>
      <span className="level-badge">{level}</span>
    </div>
    {focusMistakes && <button className="text-button" onClick={stopMistakes}>Exit mistake practice</button>}
    <article className={`flashcard ${selected ? correct ? 'answered correct' : 'answered incorrect' : ''}`} aria-live="polite">
      <p className="card-kicker">GERMAN NOUN · {current.level}</p>
      <h2>{current.noun}</h2>
      <div className="article-grid">
        {articles.map((article) => {
          const state = selected && article === current.article ? 'correct-choice' : selected === article ? 'wrong-choice' : '';
          return <button key={article} disabled={Boolean(selected)} className={`article-button ${state}`} onClick={() => onAnswer(article)}>
            <span>{article}</span>{state === 'correct-choice' && <small>✓ Correct</small>}{state === 'wrong-choice' && <small>✕ Your answer</small>}
          </button>;
        })}
      </div>
      {!selected && <p className="hint">Tap an article to reveal the answer</p>}
      {selected && <div className="answer-panel">
        <div className={`result-label ${correct ? 'success' : 'error'}`}>{correct ? '✓ Correct!' : '✕ Not quite'}</div>
        {!correct && <p>You chose <strong>{selected} {current.noun}</strong>. The correct answer is:</p>}
        <h3>{current.article} {current.noun}</h3>
        <dl><div><dt>English</dt><dd>the {current.english}</dd></div><div><dt>Plural</dt><dd>{current.plural.startsWith('—') ? current.plural : `die ${current.plural}`}</dd></div></dl>
        <button className="primary wide" onClick={onNext}>Next word <span>→</span></button>
      </div>}
    </article>
    <p className="local-note"><span aria-hidden="true">◇</span> Progress saved privately on this device</p>
  </section>;
}

function Progress({ progress, onPracticeMistakes }: { progress: NounProgress[]; onPracticeMistakes: () => void }) {
  const shown = progress.reduce((sum, item) => sum + item.shown, 0);
  const correct = progress.reduce((sum, item) => sum + item.correct, 0);
  const mastered = progress.filter(isMastered).length;
  const weak = progress.filter(needsPractice).length;
  return <section>
    <div className="page-heading"><p className="eyebrow">YOUR LEARNING</p><h1>Progress</h1><p>Small steps add up. Keep going.</p></div>
    <div className="stat-grid">
      <Stat value={shown} label="Answers" /><Stat value={progress.length} label="Nouns seen" /><Stat value={`${accuracy(correct, shown)}%`} label="Accuracy" /><Stat value={mastered} label="Mastered" />
    </div>
    <div className="panel review-panel"><div><p className="eyebrow">NEEDS ATTENTION</p><h2>{weak} {weak === 1 ? 'word' : 'words'} to strengthen</h2><p>Missed words return more often until they stick.</p></div><button className="primary" disabled={!weak} onClick={onPracticeMistakes}>Practice mistakes</button></div>
    <section className="panel"><h2>Accuracy by article</h2>{articles.map((article) => {
      const ids = new Set(vocabulary.filter((noun) => noun.article === article).map((noun) => noun.id));
      const values = progress.filter((item) => ids.has(item.id));
      const total = values.reduce((sum, item) => sum + item.shown, 0);
      const score = accuracy(values.reduce((sum, item) => sum + item.correct, 0), total);
      return <ProgressBar key={article} label={article} value={score} />;
    })}</section>
    <section className="panel"><h2>By CEFR level</h2>{LEVELS.map((level) => {
      const ids = new Set(vocabulary.filter((noun) => noun.level === level).map((noun) => noun.id));
      const encountered = progress.filter((item) => ids.has(item.id)).length;
      return <ProgressBar key={level} label={level} value={Math.round(encountered / 40 * 100)} suffix={`${encountered}/40`} />;
    })}</section>
  </section>;
}

function SettingsView({ settings, updateSettings, onExport, onImport, onReset, notice }: { settings: Settings; updateSettings: (patch: Partial<Settings>) => Promise<void>; onExport: () => void; onImport: () => void; onReset: () => void; notice: string }) {
  return <section>
    <div className="page-heading"><p className="eyebrow">MAKE IT YOURS</p><h1>Settings</h1></div>
    <section className="panel settings-panel"><h2>Practice</h2><label>CEFR level<select value={settings.level} onChange={(e) => updateSettings({ level: e.target.value as Level })}>{LEVELS.map((level) => <option key={level} value={level}>{level} — {levelNames[level]}</option>)}</select></label>
      <fieldset><legend>Vocabulary range</legend><Choice checked={settings.mode === 'level'} title="Selected level only" detail={`Only ${settings.level} words`} onChange={() => updateSettings({ mode: 'level' })} /><Choice checked={settings.mode === 'up-to'} title="Up to selected level" detail={`All words from A1 through ${settings.level}`} onChange={() => updateSettings({ mode: 'up-to' })} /></fieldset>
    </section>
    <section className="panel settings-panel"><h2>Appearance</h2><div className="segmented">{(['system','light','dark'] as Theme[]).map((theme) => <button key={theme} className={settings.theme === theme ? 'active' : ''} onClick={() => updateSettings({ theme })}>{theme[0].toUpperCase() + theme.slice(1)}</button>)}</div></section>
    <section className="panel settings-panel"><h2>Your data</h2><p>Everything stays in this browser. Export a backup before clearing browser or app data.</p><div className="button-row"><button className="secondary" onClick={onExport}>Export progress</button><button className="secondary" onClick={onImport}>Import progress</button></div>{notice && <p className="notice" role="status">{notice}</p>}<button className="danger-button" onClick={onReset}>Reset learning progress</button></section>
    <p className="data-promise">No account · No analytics · No cloud storage</p>
  </section>;
}

function NavButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: 'cards' | 'chart' | 'gear'; onClick: () => void }) {
  const symbols = { cards: '▱', chart: '▥', gear: '⚙' };
  return <button className={active ? 'active' : ''} onClick={onClick} aria-current={active ? 'page' : undefined}><span>{symbols[icon]}</span>{label}</button>;
}
function Stat({ value, label }: { value: number | string; label: string }) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div>; }
function ProgressBar({ label, value, suffix = `${value}%` }: { label: string; value: number; suffix?: string }) { return <div className="progress-row"><div><strong>{label}</strong><span>{suffix}</span></div><div className="track"><span style={{ width: `${value}%` }} /></div></div>; }
function Choice({ checked, title, detail, onChange }: { checked: boolean; title: string; detail: string; onChange: () => void }) { return <label className={`radio-choice ${checked ? 'active' : ''}`}><input type="radio" checked={checked} onChange={onChange} /><span><strong>{title}</strong><small>{detail}</small></span></label>; }

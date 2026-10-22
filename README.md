# DerDieDas

A small, mobile-first German article trainer. DerDieDas contains 240 curated nouns across CEFR A1–C2, adapts to mistakes, works offline as an installable PWA, and keeps all learning data in the browser's IndexedDB. There is no account, backend, analytics, or runtime dictionary access.

CEFR assignments are practical difficulty estimates, not an official certification.

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To test the production build:

```bash
npm run build
npm run preview
```

Run the checks with:

```bash
npm run typecheck
npm test
```

## Publish with GitHub Pages

1. Create a GitHub repository (for example, `der-die-das`).
2. Add it as the remote and push this project to the `main` branch:

   ```bash
   git remote add origin https://github.com/USERNAME/der-die-das.git
   git add .
   git commit -m "Build DerDieDas PWA"
   git push -u origin main
   ```

3. On GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for “Deploy to GitHub Pages” to succeed.
5. Visit `https://USERNAME.github.io/der-die-das/`.

The Vite build uses relative asset paths, so the app and service worker work from a repository subdirectory without hard-coding the repository name.

## Install on Android

Open the deployed HTTPS URL in Chrome. After the first page load completes, use Chrome's menu and choose **Install app** or **Add to Home screen**. Launching the installed app opens it in standalone mode. The service worker caches the application and vocabulary as they load, enabling subsequent offline use.

## Local data and backups

Answers, per-noun review schedules, mistake counts, and settings are stored only in IndexedDB on the current device. The app never sends learning data anywhere. Clearing Chrome site data or removing the installed app may erase it, so use **Settings → Export progress** first. **Import progress** accepts that JSON backup format. Resetting progress requires confirmation.

## Learning logic

Normal selection aims for roughly 50% weak words, 30% due reviews, and 20% new words, gracefully falling back when a category is empty. A wrong answer is also queued to return after at least three intervening answers. Correct streaks schedule reviews after 1, 3, 7, 21, then 45 days. A noun is mastered only after at least three consecutive correct answers and 80% overall accuracy.

## Add vocabulary

Vocabulary lives in [`src/data/vocabulary.ts`](src/data/vocabulary.ts). Add rows to the appropriate level in the form:

```ts
['Hund', 'der', 'dog', 'Hunde']
```

Keep IDs unique (they are generated from the level and noun), use only `der`, `die`, or `das`, and explicitly mark uncommon/nonexistent plurals rather than inventing one. Update the per-level count assertions in `src/data/vocabulary.test.ts` if expanding beyond 40 nouns per level.

## Project structure

- `src/App.tsx` — practice, progress, onboarding, and settings UI
- `src/learning.ts` — answer tracking, spaced scheduling, and adaptive selection
- `src/storage.ts` — IndexedDB persistence and JSON backup/restore
- `public/manifest.webmanifest` and `public/sw.js` — installability and offline caching
- `.github/workflows/deploy.yml` — tested GitHub Pages deployment

# AGENTS.md

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — Production build to `dist/`
- `npm run deploy` — Build + publish to GitHub Pages (`gh-pages -d dist`)
- No test, lint, or typecheck scripts exist. ESLint is configured but has no npm script.

## Stack

- **React 19** + **Vite 8**, plain JavaScript (JSX, no TypeScript)
- **styled-components v6** for component styles + CSS custom properties in `src/index.css`
- **Zustand v5** for state (one store per domain in `src/hooks/`)
- **react-router v8** with `HashRouter` (required for GitHub Pages)
- **Firebase Firestore** is the primary data layer (`src/firebase/firestore.js`)
- **Google Apps Script** API as secondary/legacy backend (`src/services/api.js`)
- **PWA**: service worker (`public/sw.js`), manifest (`public/manifest.webmanifest`)
- Font: Nunito (Google Fonts). Language: Spanish (UI + code comments + JSDoc)

## Architecture

```
src/
  firebase/       Firebase init + all Firestore CRUD (monolithic)
  services/       Thin wrappers over firebase/firestore.js (one per domain)
  hooks/          Zustand stores with cursor-based pagination
  pages/          Route components: Home, Ingredients, Suppliers, Bases, Purchases, Production
  components/     Shared UI — each uses folder/index.jsx + styles.js pattern
  navigation/     Menu configs (operational vs catalog)
  styles/         Breakpoints (mobile <640 <1024 desktop)
  utils/          format, stock, suppliers, units helpers
  config.js       Default Google Apps Script ID
scripts/
  generate-icons.mjs  Generates PNG icons from SVG via sharp
```

## Key Conventions

- **Component pattern**: `ComponentName/index.jsx` + `ComponentName/styles.js` (styled-components)
- **Pagination**: cursor-based, `PAGE_SIZE = 10`, stores track `cursors[]` array
- **Soft delete**: ingredients, bases, suppliers use `active` boolean flag
- **Transactions**: purchases (stock-in) and productions (stock-out) use Firestore transactions
- **Routing**: `/compras`, `/produccion` under operational layout; `/catalogo/ingredientes|proveedores|bases` under catalog layout
- **Theming**: CSS custom properties; `[data-theme='catalog']` overrides for catalog section
- **Settings**: persisted to `localStorage` key `encantos-settings` (scriptId, showErrors)
- **Deploy base**: `vite.config.js` sets `base: '/Portal/'` — all asset paths are relative to this

## Env

Copy `.env.example` to `.env`. Required vars: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

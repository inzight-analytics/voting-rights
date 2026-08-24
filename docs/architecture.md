# Architecture

## Stack

| Piece | Choice |
|-------|--------|
| App | Vite + React + TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | `react-router` **BrowserRouter** (`basename` from Vite `base`) |
| Markdown | `react-markdown` for answer/source text |
| Hosting | Static build → GitHub Pages (`dist/404.html` = `index.html` for deep links) |

No backend. The **URL is the source of truth** (no navigation store). Data is imported at build time from `src/data/*.json`.

## Data pipeline

```text
Google Sheet  ──► npm run fetch:data ──► data/sheet.csv
                                         │
                                         ▼
                              scripts/build-data.ts
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                          ▼
         src/data/hierarchy.json                     src/data/extras.json
         (issues nested in tree)                     (additional questions)
                    │                                          │
                    └──────────────────┬───────────────────────┘
                                       ▼
                              imported by the React app
```

`npm run build:data` is chained before `dev` and `build`.

Parser rules are in [hierarchy.md](./hierarchy.md).

### Build outputs

| File | Shape |
|------|--------|
| `src/data/hierarchy.json` | Tree of `{ title, description, children }`; leaves are `{ slug, title, question, enrol?, vote?, answer?, source }` |
| `src/data/extras.json` | Additional questions: `{ slug, title, answer, source }` |

## URL as state

Live site: `https://vote.inzight.co.nz`.

| Route | Meaning |
|-------|---------|
| `/` | Root question (landing page) |
| `/0/2` | Wizard depth (0-based child indices) |
| `/issue/:slug` | Issue detail |
| `/issue/:slug?from=/0/2` | Issue + back-link to that wizard level |
| `/info/:slug` | Additional question |

Invalid paths redirect to `/?notice=...`. Older `#/browse/...` hashes redirect to the matching path.

## App layout

```text
src/
  main.tsx
  App.tsx
  index.css
  data/
    appData.ts
    useAppData.ts
    hierarchy.json
    extras.json
  components/
    Shell.tsx
    Wizard.tsx
    Breadcrumbs.tsx
    IssueView.tsx
    Markdown.tsx
  pages/
    Home.tsx
    WizardPath.tsx
    IssuePage.tsx
    ExtraPage.tsx
```

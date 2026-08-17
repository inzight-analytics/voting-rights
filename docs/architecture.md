# Architecture

## Stack

| Piece | Choice |
|-------|--------|
| App | Vite + React + TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | `react-router` with **HashRouter** (GitHub Pages–friendly) |
| Markdown | `react-markdown` for answer/source text |
| Hosting | Static build → GitHub Pages |

No backend. The **URL is the source of truth** (no navigation store).

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
         (issues nested in tree)
                    │
                    ▼
         public/data/*.json  ──► React app (unchanged split shape)

GET /api/:name ──► src/data/:name.json  (`/api/issues` aliases hierarchy)
```

`npm run build:data` is chained before `dev` and `build`.

Parser rules are in [hierarchy.md](./hierarchy.md).

### Build outputs

| File | Shape |
|------|--------|
| `src/data/hierarchy.json` | Tree of `{ title, description, children }`; leaves are `{ slug, title, question, enrol?, vote?, answer?, source }` |
| `src/data/extras.json` | Additional questions: `{ slug, title, answer, source }` |
| `GET /api/:name` | JSON from `src/data/:name.json` (`/api/issues` → hierarchy) |
| `public/data/*.json` | Older split shape the current UI still fetches (`issues.json` + slug leaves) |

## URL as state

| Route | Meaning |
|-------|---------|
| `/` | Root question |
| `/browse/0/2` | Wizard depth (0-based child indices) |
| `/issue/:slug` | Issue detail |
| `/issue/:slug?from=/browse/0/2` | Issue + back-link to that wizard level |
| `/info/:slug` | Additional question |
| `GET /api/issues` | Nested hierarchy JSON |
| `GET /api/extras` | Extra questions JSON |

Invalid paths redirect to `/?notice=...`.

## App layout

```text
src/
  main.tsx
  App.tsx
  index.css
  data/
    load.ts
    hierarchy.json
    extras.json
  components/
    Shell.tsx
    Wizard.tsx
    Breadcrumbs.tsx
    ChoiceCard.tsx
    ContentCard.tsx
    IssueView.tsx
    Markdown.tsx
  pages/
    Home.tsx
    WizardPath.tsx
    IssuePage.tsx
    ExtraPage.tsx
```

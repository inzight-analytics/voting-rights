# Architecture

## Stack

| Piece | Choice |
|-------|--------|
| App | Vite + React + TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | `react-router` with **HashRouter** (GitHub Pages–friendly) |
| Markdown | `react-markdown` for markdown CSV fields |
| Hierarchy parse | `yaml` at **build time only** |
| Hosting | Static build → GitHub Pages |

No backend. No client navigation store (no Zustand/context for path) — the **URL is the source of truth**.

## Data pipeline

```text
data/core.csv          ──┐
data/hierarchy.yaml    ──┼──► scripts/build-data.ts ──► public/data/*.json ──► React app
                         │
npm run build:data       │   (also chained before `vite build`)
```

### Build outputs

| File | Shape |
|------|--------|
| `public/data/issues.json` | Map `Issue → { General, ENROLMENT, TURNOUT }`, each topic holding markdown source fields |
| `public/data/hierarchy.json` | Parsed YAML tree (same structure as source) |
| `public/data/extras.json` | Rows with `Type` `general` (and similar non-core types) for footer/info pages |

Build script responsibilities:

- Parse CSV and group by `Issue` + `Topic`
- Parse hierarchy YAML
- **Validate** every hierarchy leaf string exists as a `core` or `summary` `Issue`; warn on unused issues
- Write JSON into `public/data/`

## URL as state (shareable links)

All view state lives in the URL. Back/forward and copied links restore the same screen.

| Route | Meaning |
|-------|---------|
| `/` | Root hierarchy level |
| `/browse/0/2` | Wizard depth; path segments are **0-based child indices** (stable if titles change) |
| `/issue/:name` | Issue detail; `:name` is URI-encoded `Issue` string |
| `/issue/:name?topic=enrolment` | Issue + active tab (`general` \| `enrolment` \| `turnout`) |
| `/info/:slug` | Extra/general page |

Optional: when navigating from the wizard to an issue, set `?from=/browse/0/2` so “Back to situations” returns to that level.

Invalid paths (bad index, unknown issue) → redirect to `/` with a brief notice.

## Proposed app layout

```text
src/
  main.tsx
  App.tsx                 # routes + layout shell
  index.css               # @import "tailwindcss" + @theme tokens + fonts
  data/load.ts            # fetch built JSON
  components/
    Shell.tsx             # header brand, footer links
    Wizard.tsx            # current level: title, description, choices
    Breadcrumbs.tsx
    ChoiceCard.tsx
    IssueView.tsx         # topic tabs + markdown sections
    Markdown.tsx
  pages/
    Home.tsx
    WizardPath.tsx        # /browse/*
    IssuePage.tsx
    ExtraPage.tsx
```

## Implementation order

1. Docs (this folder) — done when committed
2. Scaffold Vite app + Tailwind + HashRouter + Shell
3. Author `data/hierarchy.yaml` covering core issues
4. `scripts/build-data.ts` + npm scripts
5. Wizard + breadcrumbs + index-based `/browse/*`
6. Issue view with URL-synced topic tabs
7. Extras footer + `/info/:slug`
8. GitHub Pages base path + production build scripts

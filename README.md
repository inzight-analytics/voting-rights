# Voting Rights

Static info site for New Zealand enrolment and voting situations. Users move through a Jotform-style one-question-per-screen hierarchy to reach issue-specific guidance (general, enrolment, turnout).

## Docs

| Doc | Contents |
|-----|----------|
| [docs/product.md](docs/product.md) | Goals, audience, content workflow |
| [docs/architecture.md](docs/architecture.md) | Stack, data pipeline, URL-as-state |
| [docs/hierarchy.md](docs/hierarchy.md) | Human-editable YAML hierarchy format |
| [docs/design.md](docs/design.md) | Drill-down UX and visual direction |

## Data

- [`data/core.csv`](data/core.csv) — exported from the Google Sheet
- [`data/dictionary.csv`](data/dictionary.csv) — column descriptions
- [`data/hierarchy.yaml`](data/hierarchy.yaml) — browsing structure (edit by hand)

## Develop

```bash
npm install
npm run dev
```

`npm run build:data` converts CSV + YAML into `public/data/*.json` (also runs before `dev` and `build`).

## Build & deploy

Configured for GitHub Pages at `/voting-rights/`:

```bash
npm run build
```

Publish the `dist/` folder (e.g. GitHub Pages from Actions or `gh-pages`).

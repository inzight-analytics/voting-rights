# Voting Rights

Static info site for New Zealand enrolment and voting situations. Users move through a Jotform-style one-question-per-screen hierarchy to reach issue-specific guidance.

## Docs

| Doc | Contents |
|-----|----------|
| [docs/product.md](docs/product.md) | Goals, audience, content workflow |
| [docs/architecture.md](docs/architecture.md) | Stack, data pipeline, URL-as-state |
| [docs/hierarchy.md](docs/hierarchy.md) | Spreadsheet outline format |
| [docs/design.md](docs/design.md) | Drill-down UX and colour theme |

## Data

- [`data/sheet.csv`](data/sheet.csv) — export of the Google Sheet tab **tidied again**
- [`data/dictionary.csv`](data/dictionary.csv) — column descriptions
- [`src/data/hierarchy.json`](src/data/hierarchy.json) — nested tree (issues inlined)
- [`src/data/extras.json`](src/data/extras.json) — additional questions

```bash
npm run fetch:data   # refresh data/sheet.csv
npm run build:data   # CSV → JSON (imported by the app)
```

## Develop

```bash
npm install
npm run dev
```

## Build & deploy

Configured for https://vote.inzight.co.nz (Vite `base: '/'`):

```bash
npm run build
```

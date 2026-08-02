# Voting Rights

Static info site for New Zealand enrolment and voting situations. Users drill down a hierarchy of situations to reach issue-specific guidance (general, enrolment, turnout).

## Status

Documentation and source CSV are in place. App scaffolding (Vite + React + Tailwind) is next — see [docs/README.md](docs/README.md).

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

Content is edited in the sheet, re-exported here, then converted to JSON at build time (see architecture docs).

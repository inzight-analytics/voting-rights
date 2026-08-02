# Voting Rights — documentation

Index of design and architecture decisions for this app. Read these before implementing.

| Doc | Contents |
|-----|----------|
| [product.md](./product.md) | Goals, audience, content workflow |
| [architecture.md](./architecture.md) | Stack, data pipeline, URL-as-state, app layout |
| [hierarchy.md](./hierarchy.md) | Human-editable YAML hierarchy format |
| [design.md](./design.md) | Drill-down UX, visual direction, Tailwind tokens |

## Current status

- **Done:** CSV data in `data/`, design and architecture documentation
- **Next:** scaffold Vite + React + TypeScript + Tailwind, then hierarchy YAML, data build script, and UI

## Content sources

- `data/core.csv` — exported from Google Sheet (issues and topics)
- `data/dictionary.csv` — column descriptions; markdown-enabled fields noted there
- `data/hierarchy.yaml` — *not yet created*; format defined in [hierarchy.md](./hierarchy.md)

# Voting Rights — documentation

Index of design and architecture decisions for this app. Read these before implementing.

| Doc | Contents |
|-----|----------|
| [product.md](./product.md) | Goals, audience, content workflow |
| [architecture.md](./architecture.md) | Stack, data pipeline, URL-as-state, app layout |
| [hierarchy.md](./hierarchy.md) | Human-editable YAML hierarchy format |
| [design.md](./design.md) | Drill-down UX, visual direction, Tailwind tokens |

## Current status

- **Done:** docs, CSV data, hierarchy YAML, data build script, Jotform-style drill-down UI, GitHub Pages base path
- **Next:** refine hierarchy copy; fill empty CSV cells; deploy `dist/` to GitHub Pages

## Content sources

- `data/core.csv` — exported from Google Sheet (issues and topics)
- `data/dictionary.csv` — column descriptions; markdown-enabled fields noted there
- `data/hierarchy.yaml` — browsing structure; format in [hierarchy.md](./hierarchy.md)

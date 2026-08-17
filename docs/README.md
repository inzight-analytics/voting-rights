# Voting Rights — documentation

Index of design and architecture decisions for this app.

| Doc | Contents |
|-----|----------|
| [product.md](./product.md) | Goals, audience, content workflow |
| [architecture.md](./architecture.md) | Stack, data pipeline, URL-as-state, app layout |
| [hierarchy.md](./hierarchy.md) | Spreadsheet outline format and parser rules |
| [design.md](./design.md) | Drill-down UX and yellow/peach/pink theme |

## Content sources

- `data/sheet.csv` — export of Google Sheet tab **tidied again**
- `data/dictionary.csv` — column descriptions
- `src/data/hierarchy.json` / `src/data/extras.json` — converted app data
- `GET /api/issues` and `GET /api/extras` — JSON endpoints

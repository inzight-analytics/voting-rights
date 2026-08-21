# Hierarchy in the spreadsheet

Hierarchy lives in [`data/sheet.csv`](../data/sheet.csv) (export of the Google Sheet tab **tidied again**). There is no separate YAML file.

Refresh with `npm run fetch:data`, then `npm run build:data`.

## Columns

| Column | Header | Role |
|--------|--------|------|
| A | TOP LEVEL | Root question, a top-level branch, or an additional-question title |
| B | BARRIERS | Next-screen prompt on a top-level row; later, a barrier group |
| C | THESE SIT NEXT TO BARRIERS | Example copy shown as chips around a barrier bubble (not clickable yet) |
| D | SPECIFIC ISSUES | Next-level choices after a barrier is selected |
| E | ANSWER | Guidance. Prefix with `Enrol -` / `Vote -` to split sections |
| F | Source? | Citation or URL |

Empty cells inherit the current parent (outline layout). Blank rows are ignored.

## Parser rules (`scripts/build-data.ts`)

1. First **A-only** row is the root (`Are you...`).
2. **A + B** → top-level branch. Title = A, description = B.
3. **A + C**, no B/D/E → stub top-level branch (e.g. help-someone copy still to come).
4. **A** otherwise → **additional question / glossary term**. Title = A, key = B (or slug of A), summary = D, answer = E, source = F.
5. **B** (A empty) → barrier group under the current top-level. Title = D or B.
6. **C and/or D** (A and B empty) → leaf under the current barrier. C = example beside the parent barrier; D = issue title on the next screen; E/F = answer.

A legend row `Key / Summary / Description` in the extras section is ignored.

Nesting follows the sheet outline and can deepen if more indented group rows are added (today: root → branch → barrier → issue).

## Outputs

Canonical files stored in the app:

- [`src/data/hierarchy.json`](../src/data/hierarchy.json) — tree of `{ title, description, children }`. Leaves are `{ slug, title, question, enrol?, vote?, answer?, source[] }`. `Enrol -` / `Vote -` (also Enrolment / Voting) prefixes become `enrol` and `vote`; leftover text stays in `answer`.
- [`src/data/extras.json`](../src/data/extras.json) — glossary / additional questions `{ key, title, summary, answer, source[] }`

## Term markers

Anywhere guidance text can include `[[key]]`. The app replaces that with a dotted-underline term that shows `summary` in a tooltip and links to `/info/:key`.

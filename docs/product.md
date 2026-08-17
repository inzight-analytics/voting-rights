# Product

## Goal

Provide enrolment and voting information for people in various situations in New Zealand (and those helping them). Users drill down through situations until they reach a specific issue, then see practical information.

## Audience

- People who need to know whether / how they can enrol or vote
- Support workers, family, and advocates helping someone else

Tone: clear, practical, non-political. Visuals follow the yellow / peach / pink board in [design.md](./design.md).

## Content workflow

1. Editors maintain one Google Sheet tab (**tidied again**)
2. `npm run fetch:data` writes [`data/sheet.csv`](../data/sheet.csv)
3. Column meanings live in [`data/dictionary.csv`](../data/dictionary.csv)
4. Hierarchy and additional questions are read from that same sheet (see [hierarchy.md](./hierarchy.md))
5. `npm run build:data` converts the outline CSV into `src/data/hierarchy.json` and `src/data/extras.json`

There is no CMS or live Sheet sync in v1.

## Product surface

- **Primary:** Jotform-style one-question-per-screen drill-down → issue answer
- **Secondary:** additional questions (footer chips and home pink cards)
- **Hosting:** static site on GitHub Pages

## Out of scope (v1)

- Search
- Live Google Sheets sync
- Auth, analytics SDKs
- Languages other than English

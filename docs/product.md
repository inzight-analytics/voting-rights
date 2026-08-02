# Product

## Goal

Provide enrolment and voting information for people in various situations in New Zealand (and those helping them). Users drill down through situations until they reach a specific issue, then see practical information.

## Audience

- People who need to know whether / how they can enrol or vote
- Support workers, family, and advocates helping someone else

Tone: clear, practical, non-political. Do not use NZ party-associated colours: blue, green, red, black+white, pink, yellow (see [design.md](./design.md)).

## Content workflow

1. Editors maintain content in a **Google Sheet**
2. Sheet is exported to [`data/core.csv`](../data/core.csv)
3. Column meanings live in [`data/dictionary.csv`](../data/dictionary.csv)
4. A separate **hierarchy** file maps browsing structure → CSV `Issue` names (see [hierarchy.md](./hierarchy.md))
5. A build step converts CSV + hierarchy into JSON for the static front-end

There is no CMS or live Sheet sync in v1.

## Data model (CSV)

| Column | Role |
|--------|------|
| `Type` | `core` (main issues), `summary` (e.g. unpublished/dormant roll), `general` (extra info pages) |
| `Issue` | Situation / topic name; hierarchy leaves match this string exactly |
| `Topic` | For core/summary: `General`, `ENROLMENT`, or `TURNOUT` |
| Markdown fields | `Examples`, `Solution`, `Electoral Commission website`, `Electoral Act`, `Independent Electoral Review`, `Andrew Geddis' Textbook`, `General Google` |

Dictionary notes some fields as markdown-enabled; the front-end will render those with a markdown renderer.

Note: the dictionary mentions a `question` type; the current export uses `general` for extra pages. Treat `general` as the extras type unless the sheet is updated.

## Product surface

- **Primary:** Jotform-style one-question-per-screen drill-down → issue detail (General / Enrolment / Turnout)
- **Secondary:** general information pages (footer links), from `Type = general` rows
- **Hosting:** static site on GitHub Pages (or similar)

## Out of scope (v1)

- Search
- Live Google Sheets sync
- Auth, analytics SDKs
- Languages other than English
- Perfect hierarchy copy (starter buckets are enough; editors refine YAML later)

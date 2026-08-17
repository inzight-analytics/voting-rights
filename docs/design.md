# Design

## UX: Jotform-style drill-down

One question per screen — not the full mind-map at once. Navigation only updates the URL.

### Level screen

- Wide, vertically centered canvas
- Level `title` as the main question, centered
- Optional `description`
- One **row** of barrier bubbles; each barrier’s first column-C example sits **above or below** it (alternating). Column D (specific issues) appears only after a barrier is chosen. Visible for now; may become hover-only later
- Home: **Additional questions** as a second row of pink bubbles
- Contextual definitions (e.g. “What is a special vote?”) are **not** implemented yet

### Breadcrumbs

Ancestor trail with **Start over** → `/`.

### Issue page

- Short title (sheet column D)
- Full question (column C) as supporting copy
- Answer split into Enrolment / Voting cards when paragraphs start with `Enrol -` or `Vote -`
- Source line under the cards

### Additional questions

Pink cards / pills. Routed as `/info/:slug`. Same drill-down chrome; not shown as a full row of eight all the time except as compact footer chips.

### Motion

Drill-**down** (enter from below + slight scale), not sideways. Tailwind transitions only.

## Visual direction

Palette is taken from the design board swatches (warm yellow canvas, peach content, pink Q&A). Avoid NZ **party-brand** blues/reds/greens as primary chrome even though a mint swatch is available for empty-state notes.

### Palette (Tailwind `@theme`)

| Token | Value | Use |
|-------|-------|-----|
| `--color-paper` | `#FFF2CC` | Page background (pale yellow) |
| `--color-peach` | `#F9CB9C` | Choice and answer cards |
| `--color-peach-deep` | `#F6B26B` | Hover on peach cards |
| `--color-pink` | `#F4CCCC` | Additional questions |
| `--color-rose` | `#EA9999` | Pink hover / emphasis |
| `--color-mint` | `#D9EAD3` | Empty-path notes only |
| `--color-ink` | `#3C3329` | Text |
| `--color-accent` | `#B5651D` | Links (umber, not party colours) |

### Typography

Source Sans 3 for display and UI (Google Fonts).

### Layout

- `max-w-6xl`, content vertically centered in the viewport
- Bubble clusters wrap into rows
- Issue/FAQ pages stay a readable text column, still centered on the canvas
- Works on mobile and desktop

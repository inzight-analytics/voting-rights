# Design

## UX: Jotform-style drill-down wizard

One question per screen (Jotform-style progressive form), not a dashboard. Navigation only updates the URL.

### Level screen

- Brand wordmark in the header (brand-first; do not let a generic headline overpower it)
- Level `title` as the main question
- Short `description`
- List of large tappable choices:
  - **Branch** → show child `title`; navigate deeper in `/browse/...`
  - **Leaf** → show issue string; go to `/issue/:name`

### Breadcrumbs

Trail of ancestor titles; each step links to that URL depth. Always offer **Start over** → `/`.

### Issue page

- Issue name as heading
- Tabs for **General / Enrolment / Turnout** — only tabs with any non-empty content
- Active tab synced to `?topic=` (`general` \| `enrolment` \| `turnout`)
- Within a tab, render filled fields in this order (omit empties):
  1. Examples
  2. Solution
  3. Electoral Commission website
  4. Electoral Act
  5. Independent Electoral Review
  6. Andrew Geddis' Textbook
  7. General Google

Optional `?from=` preserves wizard position for a “Back to situations” control.

### Extras

Footer links to general information from `extras.json` (`Type = general`), e.g. address, dormant roll, Māori roll. Routed as `/info/:slug`.

### Motion

2–3 light motions only: choice list fade/slide on level change; breadcrumb update; tab panel cross-fade. Prefer Tailwind transitions.

## Visual direction

Non-political civic look. **Do not use** NZ party-associated colours: blue, green, red, black+white, pink, yellow (or close brand matches). Also avoid common AI defaults (purple gradients, cream + serif + terracotta, broadsheet layouts).

### Palette (Tailwind `@theme`)

Warm stone + copper — neutrals that read as civic, not partisan.

| Token | Value | Use |
|-------|-------|-----|
| `--color-ink` | `#3A342E` | Text, primary UI (warm charcoal, not black) |
| `--color-paper` | `#F2EFEA` | Page background |
| `--color-accent` | `#8B5A2B` | Links, focus, choice accent (copper / umber) |
| `--color-wash` | `#E5DFD6` | Soft stone wash / gradient |

### Typography

- Display: **Fraunces** or **Source Serif 4** → `--font-display`
- UI: **Source Sans 3** → `--font-sans`
- Load via Google Fonts

### Layout / chrome

- Background: subtle wash→paper diagonal gradient + very light dot texture if needed (one small custom CSS rule OK)
- Choices: full-width rows, large hit targets — not a card grid; left border accent on hover/focus
- No floating badges, stat strips, or hero image collage
- Works on desktop and mobile

## Styling approach

- Tailwind utility classes in components
- Brand tokens registered once in `src/index.css` via `@theme`
- No CSS-module layer unless a texture background needs a one-off rule

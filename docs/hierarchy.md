# Hierarchy format

File: [`data/hierarchy.yaml`](../data/hierarchy.yaml) (to be created).

Human-editable nested YAML. Keep it minimal — no IDs, slugs, or extra metadata.

## Shape

Every **branch** node has:

- `title` — display heading / question for this level
- `description` — short supporting copy
- `children` — list of branches and/or leaves

A **leaf** is a plain string that exactly matches an `Issue` value in the CSV (`Type` = `core` or `summary`).

The **root** uses the same shape as any branch.

## Example

```yaml
title: Who needs voting information?
description: Choose the situation that best matches you or someone you are helping.
children:
  - title: Detention or custody
    description: Prison, remand, home detention, or mental health detention.
    children:
      - People serving a prison sentence
      - People on remand
      - People on home detention or serving community-based sentence
      - People sectioned under the Mental Health Act

  - title: Health or care
    description: Hospital, rest home, or difficulty leaving home.
    children:
      - People in the hospital
      - People who live in a rest home
      - Can't leave care/the house
```

## Rules

| Rule | Detail |
|------|--------|
| Branch | Object with `title`, `description`, `children` |
| Leaf | String = CSV `Issue` name (exact match) |
| Nesting | Unlimited |
| Matching | Leaf ↔ `Issue` for `core` or `summary` rows |
| Root | Same fields as any branch |
| No IDs | Titles are display copy only; leaves are the join key |

## Starter grouping

Group the ~33 core issues into top-level buckets so the wizard is usable immediately, for example:

- Detention or custody
- Health or care
- Disability or access needs
- Housing or address
- Work or travel on election day
- Age or eligibility
- Overseas or migration
- Rolls (summary issues: unpublished / dormant — if linked as leaves)

Editors can rename titles and re-nest freely; leaf strings must stay in sync with the Sheet/`Issue` column.

## Validation

`npm run build:data` should:

1. Fail (or error loudly) if a leaf string has no matching issue
2. Warn if a `core`/`summary` issue is never referenced in the hierarchy

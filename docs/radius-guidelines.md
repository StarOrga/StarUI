# Radius tokens and role mapping

> See also: [STYLEGUIDE.md §4 Border & Radius](STYLEGUIDE.md#4-border--radius)

The UI uses a fixed radius scale. RSI design principle: **sharp edges only (0–4px max)**.

**Source:** `modules/shared/design-system/lib/design-tokens.css` (canonical), `modules/desktop/shared/styles/desktop-theme.css` (extended)

## Scale

| Token | Value | Notes |
|---|---|---|
| `--radius-xs` | `2px` | Edge cases, minimal rounding |
| `--radius-sm` | `2px` | Compact elements, badges, scrollbar tracks |
| `--radius-md` | `4px` | Inputs, selects, small cards |
| `--radius-lg` | `4px` | Panels, buttons, card surfaces |
| `--radius-xl` | `4px` | Large surfaces (same as lg — intentionally sharp) |
| `--radius-pill` | `999px` | Pills, chips, toggle tracks |

## Semantic aliases (desktop-theme.css)

| Alias | Points to | Usage |
|---|---|---|
| `--radius-surface` | `var(--radius-lg)` = 4px | Window/card surfaces, panels |
| `--radius-input` | `var(--radius-md)` = 4px | Form fields, selection controls |
| `--radius-button` | `var(--radius-lg)` = 4px | Primary and secondary buttons |
| `--radius-chip` | `var(--radius-pill)` = 999px | Badges, chips, tag/pill elements |

## Justified exceptions

- `border-radius: 50%` for true circles (e.g., avatar/status indicators, corner logo).
- `border-radius: 0` for hard edges (e.g., drag regions, app shell `--shell-app-radius: 0`).
- `border-radius: inherit` when a child must match the parent radius.
- Asymmetric edges (e.g., overlay cards) with token combinations like `0 0 var(--radius-lg) var(--radius-lg)`.

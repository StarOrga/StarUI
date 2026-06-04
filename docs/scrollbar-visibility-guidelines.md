# Scrollbar Visibility Guidelines

## Goal
Keep scrolling discoverable on interactive/critical workflows while allowing decorative surfaces to hide native scrollbar chrome when it improves visual polish.

## Scrollbars must remain discoverable
Do **not** hide scrollbar affordances on:
- `.settings-panel`
- custom select menus (for example, `.space-select-menu`)
- long, user-operated content lists and panes (for example, `.content-main` and any primary data/settings list)

For these surfaces, prefer visible native scrollbars or equivalent always-on affordance (for example, stable gutter + visible thumb styling).

## Scrollbars may be hidden
Scrollbar suppression is only allowed on non-critical ornamental containers where:
- content is supplemental/decorative,
- no core task depends on discovering scroll, and
- an alternate interaction cue exists when needed.

Use the scoped utility class `.ornamental-scroll-surface` for these cases instead of global `*` rules.

## Prohibited pattern
- Global scrollbar suppression selectors such as `*::-webkit-scrollbar` or universal `scrollbar-width: none` are prohibited in desktop themes.

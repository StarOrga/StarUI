# Desktop Dropdown Behavior

Desktop settings dropdowns use the native `<select>` as the source of truth and layer the custom `space-select` UI on top of it.

## Ownership

- Runtime behavior: `modules/desktop/src/renderer.js`
- Shared dropdown visuals: `@starorga/star-ui/shell/desktop-theme.css`
- Angular setup-step structural option copy: `modules/desktop/ui-angular/src/app/app.ts`

## Rules

- Build runtime option labels with DOM APIs (`createElement`, `new Option`) instead of HTML-string interpolation.
- Normalize dropdown labels through the shared desktop text helper before rendering.
- Preserve valid Unicode text end to end; only apply mojibake repair when text already matches known corruption patterns.
- Treat empty and single-option dropdowns as explicit UI states in `space-select`; do not mutate native `select.disabled` just because option count is `0` or `1`.
- Setup audio dropdowns must structurally clone/copy source options so labels, selection state, and Unicode text stay consistent with the main settings controls.

## Rendering Notes

- The custom trigger value, native option text, and custom menu item text should come from the same normalized label pipeline.
- Empty dropdowns surface a clear "no options" state.
- Single-option dropdowns remain visually stable and non-interactive without pretending the owning feature disabled the field.

## Angular `scc-select` option extensions

`SccSelectOption` (Angular `scc-select`, `modules/desktop/ui-angular/src/app/scc-select.component.ts`) supports optional per-option fields — all additive, absent fields render exactly as before:

- `disabled` — option is skipped by keyboard navigation, guarded against click, and exposed via `aria-disabled`.
- `badge` / `badgeKind` (`recommended` | `warning` | `info`) — rendered via the global `.scc-dropdown-meta` slot (used for "Recommended", "Not installed", "Slow (reasoning)" markers in the AI model dropdowns).
- `tooltip` — per-option tooltip via the shared `TooltipDirective`.
- The menu flips upward when the space below is insufficient (prevents clipping inside `overflow: hidden` ancestors, e.g. the last finetune accordion card at the 1120×630 window floor) and scrolls internally via max-height.

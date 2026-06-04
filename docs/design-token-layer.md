# Design Token Layer

This project uses a layered token/theme model so reusable styling stays centralized and module files only carry local overrides.

## Layer 1: Shared global tokens (`modules/shared/design-system/lib/design-tokens.css`)

Global semantic tokens live in one shared place and are consumed by every UI surface:

- **Surface** (`--surface-*`): canvas, panel, and overlay surfaces.
- **Text** (`--text-*`): primary/secondary text.
- **Accent** (`--accent-*`): primary accent, strong accent, warning, danger.
- **Border** (`--border-*`): subtle/default/strong borders.
- **Radius** (`--radius-*`): standard radii (`sm` to `xl`).
- **Shadow** (`--shadow-*`): soft/elevated/glow.
- **Font**: semantic typography tokens define the shared families: `--font-body-text` (Inter), `--font-heading-category` (Orbitron), and `--font-handwritten-accent` (Caveat).

### Approved font system (UI modules)

The approved font system is intentionally capped at **three families** for all Angular UI modules:

1. `Inter` via `--font-body-text`
2. `Orbitron` via `--font-heading-category`
3. `Caveat` via `--font-handwritten-accent`

UI modules must not introduce additional font families. Font usage should always flow through semantic tokens rather than direct family literals.

### Semantic typography usage rules

- Use `--font-body-text` for default body copy, controls, labels, and data values.
- Use `--font-heading-category` for section/category headings and title-like UI affordances.
- Use `--font-handwritten-accent` only for approved attribution text (see special case below).
- Do not hardcode `font-family: "..."` in module/component CSS for UI modules.

### Special-case handwritten attribution rule

`--font-handwritten-accent` is a strict exception token:

- Allowed only for attribution treatments (for example, "community made by ...").
- Not allowed for body content, settings labels, table/grid values, controls, or navigation.
- Keep handwritten usage tightly scoped to attribution selectors so it cannot leak into general typography.

Compatibility aliases (`--bg`, `--text`, `--accent`, ...) remain available for incremental migration.

Shared semantic typography selectors (`.typography-body-text`, `.typography-heading-category`, `.typography-handwritten-accent`) are also defined in the same layer for consistent usage across Angular UI modules.

## Layer 2: Shared cross-window tokens (`modules/shared/design-system/lib/cursor-tokens.css`)

Cross-window cursor tokens are centralized and reused by desktop/loading/overlay:

- `--cursor-default`
- `--cursor-pointer`
- `--cursor-text`

Module styles should consume these tokens and only override variables when absolutely necessary.

## Layer 3: Shared desktop shell + theme (`modules/desktop/shared/styles/*`)

Desktop-wide shared styling is split into two reusable layers:

- `desktop-shell-base.css`: shell/layout foundation (`.app`, `.titlebar`, `.header`, `.notice`, `.titlebar-btn`) with configurable `--shell-*` override variables.
- `desktop-theme.css`: component/theme source of truth for settings/dropdown controls (`.settings-select`, `.space-select*`) and shared interactive states.

Any desktop module-specific file should prefer variable overrides (`--shell-*`, `--settings-select-*`) instead of re-defining the same selectors.
Desktop dropdown behavior details live in `docs/ui/desktop-dropdown-behavior.md`.

## Layer 4: Module overrides (`modules/*/ui-angular/src/*.css`)

Window-specific differences are defined through module variables only:

- **Desktop Angular**: `modules/desktop/ui-angular/src/styles.css` sets desktop-specific shell and settings-select token overrides.
- **Loading Angular**: `modules/loading/ui-angular/src/styles.css` keeps `--window-loading-*` surface/accent tokens.
- **Overlay Angular**: `modules/overlay/ui-angular/src/styles.css` keeps `--window-overlay-*` visual tokens.

This keeps base behavior stable while allowing each window to tune its look via controlled, event-safe overrides.

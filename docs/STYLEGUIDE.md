# Star Citizen Companion — Visual Style Guide

> **Source of truth** for every visual element in the SCC desktop and overlay applications.
> Every color, font, spacing value, cursor, button variant, card, animation, and icon documented here
> must match the actual CSS/TS source files. When this guide and code diverge, **code wins** — then
> update this guide to match.

**Companion documents** (referenced inline, not duplicated):
- [`cursor-guidelines.md`](cursor-guidelines.md) — cursor policy enforcement and CI lint rules
- [`design-token-layer.md`](design-token-layer.md) — 4-layer token architecture overview
- [`scrollbar-visibility-guidelines.md`](scrollbar-visibility-guidelines.md) — scrollbar behavior rules

---

## Table of Contents

1. [Color System](#1-color-system)
2. [Typography](#2-typography)
3. [Spacing & Layout](#3-spacing--layout)
4. [Border & Radius](#4-border--radius)
5. [Shadows & Glows](#5-shadows--glows)
6. [Cursors](#6-cursors)
7. [Buttons](#7-buttons)
8. [Cards & Kacheln](#8-cards--kacheln)
9. [Navigation](#9-navigation)
10. [Forms & Controls](#10-forms--controls)
11. [Scrollbars](#11-scrollbars)
12. [Animations & Transitions](#12-animations--transitions)
13. [Icons, Logos & Brand Assets](#13-icons-logos--brand-assets)
14. [Window Surfaces & Backgrounds](#14-window-surfaces--backgrounds)
15. [Loading & Status Indicators](#15-loading--status-indicators)

---

## 1. Color System

**Source:** `modules/shared/design-system/lib/design-tokens.css`

### 1.1 Surface Palette

| Token | Hex | Usage |
|---|---|---|
| `--surface-canvas` | `#0d2635` | App background, deepest layer |
| `--surface-canvas-alt` | `#103246` | Alternate panels, zebra striping |
| `--surface-panel` | `#123246` | Card/panel backgrounds |
| `--surface-panel-strong` | `#164664` | Emphasized panels, active states |
| `--surface-overlay` | `rgba(8, 20, 28, 0.95)` | Modal overlays, dropdowns |

### 1.2 Text Palette

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#e8ebed` | Body text, primary labels |
| `--text-secondary` | `#9fb3c8` | Muted text, descriptions, captions |
| `--text-inverse` | `#0d2635` | Text on light/accent backgrounds |

### 1.3 Accent Palette

| Token | Hex | Usage |
|---|---|---|
| `--accent-primary` | `#52c1e6` | Primary interactive cyan — links, active borders, highlights |
| `--accent-strong` | `#7dd5f0` | Bright cyan — strong hover, emphasized labels |
| `--accent-gold` | `#c8a84b` | Gold — secondary accent, companion features, premium feel |
| `--accent-gold-strong` | `#e8c96b` | Bright gold — active gold states, selected items |
| `--accent-success` | `#5fd698` | Success states, health-OK indicators, positive feedback |
| `--accent-warning` | `#f0c27b` | Warning states, community content badge |
| `--accent-danger` | `#c0392b` | Error states, destructive actions, close button hover |

### 1.4 Border Palette

| Token | Value | Usage |
|---|---|---|
| `--border-subtle` | `rgba(82, 193, 230, 0.18)` | Resting card borders, dividers |
| `--border-default` | `rgba(82, 193, 230, 0.3)` | Standard input/panel borders |
| `--border-strong` | `rgba(82, 193, 230, 0.45)` | Active/focused borders, select elements |

### 1.5 Spatial Navigation Colors

**Source:** `modules/desktop/ui-angular/src/app/spatial-nav.css`

| Token | Hex | Usage |
|---|---|---|
| `--sn-red` | `#ff8282` | Alert, close actions in nav context |
| `--sn-purple` | `#8c64c8` | Organization/fleet views |
| `--sn-gold` | `#c8a84b` | Premium/companion content |
| `--sn-warm` | `#f0c27b` | Warnings, community content |
| `--sn-teal` | `#52c8be` | Ship/vehicle content |
| `--sn-blue` | `#6490e6` | Information/loadout views |

### 1.6 Status Colors

| Context | Color | Hex | Usage |
|---|---|---|---|
| OK/Success | Green | `#5fd698` / `rgba(95, 214, 152, 0.95)` | Health dots, success indicators |
| Warning | Gold | `#f0c27b` / `rgba(247, 199, 102, 0.96)` | Warning dots, attention needed |
| Error | Red | `#ff8282` / `rgba(255, 130, 130, 0.95)` | Error dots, action required |
| Idle | Muted | `rgba(120, 150, 168, 0.55)` | Idle/unknown status |

### 1.7 Backward-Compatible Aliases

These aliases exist in `design-tokens.css` for legacy code. **New code should use the canonical token names above.**

| Alias | Points to |
|---|---|
| `--bg` | `--surface-canvas` |
| `--bg-alt` | `--surface-canvas-alt` |
| `--surface` | `--surface-panel` |
| `--surface-strong` | `--surface-panel-strong` |
| `--text` | `--text-primary` |
| `--muted` | `--text-secondary` |
| `--accent` | `--accent-primary` |
| `--danger` | `--accent-danger` |
| `--official` | `--accent-strong` |
| `--success` | `--accent-success` |
| `--community` | `--accent-warning` |
| `--stroke` | `--border-subtle` |

### 1.8 Do / Don't

- **Do** use design tokens for all color values
- **Do** use `rgba()` with cyan base (`82, 193, 230`) for transparent borders/glows
- **Don't** hardcode hex values in component styles
- **Don't** use Material Design default colors
- **Don't** introduce light backgrounds — dark mode only, always

---

## 2. Typography

**Source:** `modules/shared/design-system/lib/design-tokens.css`

### 2.1 Font Families (60:30:10 Strategy)

The app uses exactly **three** font families in a 60:30:10 ratio. No other fonts are allowed — no fallback stacks beyond the generic family (e.g. `sans-serif`), no "close enough" alternatives like Exo 2 or Share Tech Mono.

| Token | Family | Role | Ratio | Weights |
|---|---|---|---|---|
| `--font-body-text` | `Inter` | Body text, labels, descriptions, input values | 60% | 400, 500, 600, 700 |
| `--font-heading-category` | `Orbitron` | Headings, page titles, nav labels, eyebrow text | 30% | 400, 500, 600, 700 |
| `--font-handwritten-accent` | `Caveat` | Attribution text only (e.g. "Community Made By") | 10% | 400, 500, 600, 700 |

### 2.2 Typography Classes

| Class | Font | Auto-applied to |
|---|---|---|
| `.typography-body-text` | Inter | `body` element (default) |
| `.typography-heading-category` | Orbitron | `h1`–`h6` via `:where()` selector |
| `.typography-handwritten-accent` | Caveat | Manual only — attribution text |

### 2.3 Common Text Patterns

| Pattern | Size | Weight | Letter-spacing | Transform | Example |
|---|---|---|---|---|---|
| Page title | — | — | — | uppercase | `.sn-page-title` in spatial nav |
| Nav zone label | 7–9px | 600 | 0.14em | uppercase | `.sn-nz-label` |
| Corner text | 10px | — | 0.08em | uppercase | `.sn-corner-text` |
| Eyebrow label | 9px | — | 0.16em | uppercase | `.space-select-eyebrow` |
| Button/badge text | 9–12px | — | 0.08–0.16em | uppercase | `.status-button`, `.space-select-sparse-badge` |
| Body text | 12–13px | 400 | 0.01–0.025em | none | General content |
| Titlebar text | 14px | — | 0.12em | uppercase | `.titlebar-text` (Orbitron) |

### 2.4 Do / Don't

- **Do** use ALL CAPS + wide letter-spacing for labels and navigation elements
- **Do** keep body text at Inter 12–13px for information-dense layouts
- **Don't** use Caveat for anything except attribution lines
- **Don't** use font-size above 14px for UI labels (this is a compact HUD, not a website)
- **Don't** use font-weight below 400
- **Don't** add fallback fonts beyond the generic family — `'Orbitron', sans-serif` is correct; `'Orbitron', 'Exo 2', sans-serif` is not

---

## 3. Spacing & Layout

**Source:** `modules/shared/design-system/lib/design-tokens.css` (shared spacing), `modules/desktop/shared/styles/desktop-theme.css` (layout), `desktop-shell-base.css` (shell)

### 3.1 Spacing Tokens

| Token | Value | Source | Usage |
|---|---|---|---|
| `--space-xs` | `clamp(4px, 0.35vw, 6px)` | `design-tokens.css` | Tight inner padding, icon gaps |
| `--space-sm` | `clamp(8px, 0.55vw, 10px)` | `design-tokens.css` | Small gaps between elements |
| `--space-md` | `clamp(12px, 0.85vw, 16px)` | `design-tokens.css` | Standard section padding |
| `--space-lg` | `clamp(16px, 1.2vw, 22px)` | `design-tokens.css` | Large gaps, section separators |

### 3.2 Shell Layout Tokens

| Token | Value | Usage |
|---|---|---|
| `--layout-top-padding` | `32px` | Top padding of `.app` container |
| `--layout-section-gap` | `16px` | Gap between major sections |
| `--shell-app-padding-inline` | `40px` | Left/right app padding |
| `--shell-app-padding-bottom` | `16px` | Bottom app padding |
| `--shell-app-radius` | `0` | App container radius (none) |

### 3.3 Spatial Navigation Margins

| Token | Value | Usage |
|---|---|---|
| `--sn-margin-x` | `6vw` | Horizontal margin for spatial view content |
| `--sn-margin-y` | `7vh` | Vertical margin for spatial view content |

### 3.4 Grid Patterns

| Pattern | Columns | Min width | Usage |
|---|---|---|---|
| `.sn-grid` | `auto-fill` | `240px` | General card grids |
| `.sn-ships-grid` | `auto-fill` | `240px` | Ship card grids |
| `.sn-erkul-slots` | `auto-fill` | `200px` | Equipment slot grids |
| `.sn-ops-grid` | `auto-fill` | `280px` | Operations card grids |

### 3.5 App Layout Structure

```
.app (flex column, full viewport)
├── .titlebar (grid: auto 1fr auto, min-height 44px)
│   ├── .titlebar-left (flex, gap 12px)
│   ├── .titlebar-center (absolute centered)
│   └── .titlebar-actions (flex, gap 8px)
├── .spatial-world (transform-based view navigation)
│   ├── .spatial-view[0..8] (100vw × 100vh each)
│   │   └── .spatial-view-inner (scrollable content area)
│   ├── .sn-nav-zone--t/b/l/r (fixed cardinal nav triggers)
│   └── canvas#nebula (background effects)
├── .settings-panel (overlay, z-index 60)
└── .setup-shell (overlay, z-index 70)
```

### 3.6 Do / Don't

- **Do** use `clamp()` spacing tokens for viewport-responsive sizing
- **Do** keep layouts information-dense — this is a HUD, not a marketing page
- **Don't** use `margin: auto` for centering — prefer `display: grid; place-items: center`
- **Don't** add `padding` above `--space-lg` (24px) — tighter is better

---

## 4. Border & Radius

**Source:** `modules/shared/design-system/lib/design-tokens.css`, `modules/desktop/shared/styles/desktop-theme.css`

### 4.1 Radius Scale

| Token | Value | Semantic alias | Usage |
|---|---|---|---|
| `--radius-xs` | `2px` | — | Edge cases, minimal rounding |
| `--radius-sm` | `2px` | — | Compact elements, badges |
| `--radius-md` | `4px` | `--radius-input` | Inputs, selects, small cards |
| `--radius-lg` | `4px` | `--radius-surface`, `--radius-button` | Panels, buttons, card surfaces |
| `--radius-xl` | `4px` | — | Large surfaces (same as lg — RSI sharp edges) |
| `--radius-pill` | `999px` | `--radius-chip` | Pills, chips, toggle tracks |

### 4.2 RSI Design Principle

> **Sharp edges only.** Maximum radius is 4px. The only exception is `--radius-pill` (999px) for
> pills and chips. No rounded corners above 4px. Beveled/angular feel > soft/rounded.

### 4.3 Window Border

```css
--window-border: 1px solid rgba(82, 193, 230, 0.25);
--window-radius: 4px;
```

### 4.4 Do / Don't

- **Do** use 0–4px radius for all rectangular elements
- **Do** use `--radius-pill` only for pills, chips, and toggle tracks
- **Don't** use border-radius above 4px on any rectangular element
- **Don't** use rounded corners on the app shell itself (`--shell-app-radius: 0`)

---

## 5. Shadows & Glows

**Source:** `modules/shared/design-system/lib/design-tokens.css`

### 5.1 Shadow Tokens

| Token | Value | Usage |
|---|---|---|
| `--shadow-soft` | `0 0 0 1px rgba(82, 193, 230, 0.2)` | Subtle border-ring, resting state |
| `--shadow-elevated` | `0 0 0 1px rgba(82, 193, 230, 0.3), 0 0 12px rgba(82, 193, 230, 0.12)` | Elevated panels, dropdowns |
| `--shadow-glow` | `0 0 16px rgba(82, 193, 230, 0.25)` | Glow effect, hover emphasis |

### 5.2 RSI Design Principle

> **Border glows only — no drop shadows.** Never use positive-Y box-shadows that simulate
> real-world light. Use inset borders and outward glow effects to create depth.

### 5.3 `box-shadow` vs `filter: drop-shadow()`

| Property | Use when | Example |
|---|---|---|
| `box-shadow` | Rectangular elements, borders, inset effects | Cards, panels, buttons, inputs |
| `filter: drop-shadow()` | Irregular/non-rectangular shapes, SVG elements, keyframe animations | SVG icons, logo arcs, clipped elements |

`filter: drop-shadow()` respects the element's alpha channel (follows the shape), while `box-shadow` always produces a rectangle. Use `filter` for glows on SVGs and complex shapes; use `box-shadow` for everything else.

### 5.4 Control State Shadows

See [Section 7.2 (Interactive States)](#72-interactive-states-all-buttons) for per-state shadow definitions.

---

## 6. Cursors

**Source:** `modules/shared/design-system/lib/cursor-tokens.css`, `modules/desktop/shared/styles/desktop-theme.css`, `modules/desktop/ui-angular/src/app/cursor-animator.service.ts`

### 6.1 Cursor Color Palette

| Name | Hex | RGB | Usage |
|---|---|---|---|
| Dark RSI | `#1e6a82` | `rgb(30, 106, 130)` | Default resting state |
| Bright Cyan | `#52c1e6` | `rgb(82, 193, 230)` | Hover/pointer state |
| CIG Gold | `#b8952e` | `rgb(184, 149, 46)` | Click body sweep color |
| Gold Hot | `#f0d060` | `rgb(240, 208, 96)` | Click dot flash |
| Red | `#c0392b` | `rgb(192, 57, 43)` | Forbidden/not-allowed |
| Hull BG | `#0d2635` | — | Wait cursor fill background |

### 6.2 Cursor Token Reference

All cursors are SVG data-URIs defined as CSS custom properties. Canonical names use `--scc-cursor-*` prefix; short aliases `--cursor-*` are available for convenience.

| Token (short alias) | Shape | Color | Context |
|---|---|---|---|
| `--cursor-default` | Sentinel Arrow | Dark RSI | Body, structural elements, disabled elements |
| `--cursor-pointer` | Sentinel Arrow | Bright Cyan | All interactive elements (buttons, links, tabs, toggles) |
| `--cursor-gold` | Sentinel Arrow + Gold Dot glow | Gold Hot | Active/pressed state (applied by CursorAnimatorService) |
| `--cursor-text` | Thick I-beam | Bright Cyan | Text inputs, textareas, contenteditable |
| `--cursor-vertical-text` | Horizontal I-beam | Dark RSI | Vertical text selection (rare) |
| `--cursor-wait` | Quantum Ring (8-frame anim) | Cyan + Hull BG | Full blocking operations |
| `--cursor-progress` | Sentinel Arrow + Loading Ring | Dark RSI + Cyan ring | Background tasks (non-blocking) |
| `--cursor-not-allowed` | Red Prohibition Circle | Red | Forbidden actions, blocked UI |
| `--cursor-no-drop` | Sentinel Arrow + Red ✕ badge | Dark RSI + Red | Invalid drop target during drag |
| `--cursor-grab` | Open Docking Clamp | Dark RSI | Draggable elements at rest |
| `--cursor-grabbing` | Closed Docking Clamp | Gold | Element being actively dragged |
| `--cursor-copy` | Sentinel Arrow + Cyan "+" badge | Dark RSI + Cyan | Copy/duplicate drag operations |
| `--cursor-alias` | Sentinel Arrow + Link badge | Dark RSI + Cyan | Alias/shortcut creation |
| `--cursor-move` | 4-directional Arrow | Dark RSI | Movable/repositionable elements |
| `--cursor-all-scroll` | 4-directional Arrow | Dark RSI | Scroll in any direction |
| `--cursor-col-resize` | Column Resize | Dark RSI | Column border drag |
| `--cursor-row-resize` | Row Resize | Dark RSI | Row border drag |
| `--cursor-ns-resize` | N/S Resize | Dark RSI | Vertical resize handle |
| `--cursor-ew-resize` | E/W Resize | Dark RSI | Horizontal resize handle |
| `--cursor-nesw-resize` | NE/SW Resize | Dark RSI | Diagonal resize |
| `--cursor-nwse-resize` | NW/SE Resize | Dark RSI | Diagonal resize |
| `--cursor-crosshair` | Crosshair | Bright Cyan | Precision selection (capture picker) |
| `--cursor-zoom-in` | Magnifier + "+" | Dark RSI | Zoom in action |
| `--cursor-zoom-out` | Magnifier + "−" | Dark RSI | Zoom out action |
| `--cursor-help` | Sentinel Arrow + "?" badge | Gold | Help/info trigger elements |
| `--cursor-context-menu` | Sentinel Arrow + Menu badge | Dark RSI | Context menu triggers |

### 6.3 Animated Cursor States (CursorAnimatorService)

**Source:** `cursor-animator.service.ts`

| Animation | Trigger | Frames | Timing | Visual |
|---|---|---|---|---|
| **Body Sweep** | `mouseenter` on interactive element | 16 frames | 35ms/frame (560ms total) | Arrow color interpolates Dark RSI → Bright Cyan |
| **Gold Dot Flash** | `mousedown` | Instant | — | Switches to `--cursor-gold` (gold arrow + glow dot) |
| **Gold Body Sweep** | `mousedown` sustained | 16 frames | 35ms/frame | Arrow body sweeps to CIG Gold |
| **Wait Ring** | `startWait()` call | 8 frames | 120ms/frame (960ms cycle) | Quantum ring rotates, orbiting cyan dot |
| **Drag Detection** | `mousedown` on `.scatter-tile`, `[draggable]` | — | — | Switches to `--cursor-grabbing` |

### 6.4 Global Cursor Cascade

**Source:** `desktop-theme.css`

```
body                                    → --cursor-default
├── a, button, select, label, summary,
│   [role="button/tab/link/menuitem"],
│   [tabindex]:not([-1]),
│   .settings-link, .settings-select,
│   .carousel-dot, .scatter-tile,
│   .edge-nav-zone                      → --cursor-pointer
├── input[type=text/search/email/url/
│   number/password], textarea,
│   [contenteditable="true"]            → --cursor-text
├── :disabled, [aria-disabled="true"]   → --cursor-default (override)
└── * { cursor: inherit }              (all other elements inherit parent)
```

### 6.5 Golden Rule

> **The app must NEVER show a native Windows cursor.** Every element must resolve to an SCC cursor
> token. CI enforcement: `npm run lint:cursor-policy` blocks hardcoded `cursor:` values.

See [`cursor-guidelines.md`](cursor-guidelines.md) for the full enforcement policy.

### 6.6 Do / Don't

- **Do** use `var(--cursor-pointer)` for all interactive elements
- **Do** let cursor cascade via `cursor: inherit` — don't set cursors on individual child elements
- **Don't** hardcode `cursor: pointer`, `cursor: default`, or any native cursor keyword
- **Don't** use `url(...)` cursors directly — always go through a token

---

## 7. Buttons

**Source:** `modules/shared/design-system/lib/control-states.css`, `modules/desktop/shared/styles/desktop-theme.css`, `spatial-nav.css`

### 7.1 Button Variants

| Class | Role | Shape | Border | Background | Context |
|---|---|---|---|---|---|
| `.ui-control-primary` | Primary CTA | Rectangle | Cyan strong | Transparent | Main action in any context |
| `.ui-control-secondary` | Secondary action | Rectangle | Cyan default | Transparent → `rgba(18, 50, 70, 0.32)` on hover | Supporting actions |
| `.ui-control-icon` | Icon-only button | Square | None | Transparent → `rgba(18, 50, 70, 0.45)` on hover | Toolbar/compact actions |
| `.ui-control-link` | Link-styled button | Inline | None | Transparent | Inline actions, "retry" links |
| `.notice-btn` | Notice/banner button | Pill | Subtle | Transparent | Dismissal/CTA in notice bars |
| `.notice-btn.ghost` | Ghost notice button | Pill | Lower contrast | Transparent | Secondary notice action |
| `.sn-corner-btn` | Corner chrome button | Square 34–38px | 1px transparent | Transparent | Minimize, maximize, settings |
| `.sn-corner-btn--close` | Close corner button | Square | 1px transparent | Transparent → red-tinted on hover | Window close |
| `.sn-launch-pill` | Game launch pill | Pill | Gold/cyan 1px | Dark | Launch/stop Star Citizen |
| `.sn-launch-pill--running` | Launch pill (game active) | Pill | Cyan glow | Dark | Game is running |
| `.sn-launch-pill--ready` | Launch pill (ready) | Pill | Gold | Dark | Game ready to launch |
| `.titlebar-btn` | Titlebar button | Rectangle 34×28px | 1px transparent | Transparent | Window chrome actions |
| `.titlebar-btn.close` | Close titlebar button | Rectangle | — | → `rgba(255, 111, 111, 0.14)` on hover | Window close |
| `.titlebar-btn.gear` | Settings titlebar button | Rectangle | — | → hover shows text color | Open settings |
| `.host-companion-button` | Companion toggle | Pill | Gold/cyan | Dark | Toggle companion panel |
| `.host-filters-button` | Filters toggle | Pill | Cyan | Dark | Toggle filters panel |
| `.host-filters-option` | Filter mode selector | Pill | — | → `.is-active`: cyan gradient | Active filter mode |
| `.status-button` | Loading screen button | Rectangle | — | — | Loading screen actions |
| `.status-button.primary` | Primary loading button | Rectangle | — | Accent fill | Primary loading action |
| `.status-button.danger` | Danger loading button | Rectangle | — | Danger fill | Error/retry action |
| `.scatter-filter-btn` | Scatter filter toggle | Rectangle | Subtle glow | Transparent | News filter toggles |
| `.settings-link` | Settings link button | Inline | None | Transparent | In-settings secondary actions |
| `.settings-link--small` | Small settings link | Inline | None | Transparent | Compact settings actions |

### 7.2 Interactive States (All Buttons)

**Source:** `control-states.css` — applies to `.ui-control-primary`, `.ui-control-secondary`, `.ui-control-icon`, `.ui-control-link`, `.settings-select`, `.space-select-button`

| State | Property | Value |
|---|---|---|
| **Default** | `transition` | `color 0.2s, background-color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.12s` |
| **:hover** | `color` | `var(--ctrl-hover-text, #eaf6ff)` |
| | `background` | `var(--ctrl-hover-bg, transparent)` |
| | `border-color` | `var(--ctrl-hover-border, rgba(125, 213, 240, 0.6))` |
| | `box-shadow` | `var(--ctrl-hover-shadow, 0 0 10px rgba(125, 213, 240, 0.28))` |
| **:active** | `transform` | `translateY(1px)` |
| | `box-shadow` | `var(--ctrl-active-shadow, inset 0 0 0 1px rgba(125, 213, 240, 0.25))` |
| **:focus-visible** | `outline` | `2px solid var(--ctrl-focus-ring, rgba(148, 234, 255, 0.95))` |
| | `outline-offset` | `2px` |
| | `box-shadow` | `0 0 0 2px var(--ctrl-focus-contrast, rgba(9, 25, 37, 0.92)), var(--ctrl-focus-glow, 0 0 0 4px rgba(125, 213, 240, 0.35))` |
| **:disabled** | `opacity` | `0.65` |
| | `color` | `var(--ctrl-disabled-text, rgba(174, 197, 210, 0.88))` |
| | `border-color` | `var(--ctrl-disabled-border, rgba(82, 193, 230, 0.2))` |
| | `box-shadow` | `none` |
| | `cursor` | `var(--cursor-default)` |
| | `pointer-events` | `none` |

### 7.3 Per-Variant State Overrides

| Variant | Override token | Value |
|---|---|---|
| `.ui-control-primary` | `--ctrl-hover-shadow` | `0 0 14px rgba(82, 193, 230, 0.36)` (stronger glow) |
| `.ui-control-secondary` | `--ctrl-hover-bg` | `rgba(18, 50, 70, 0.32)` |
| `.ui-control-icon` | `--ctrl-hover-bg` | `rgba(18, 50, 70, 0.45)` |
| | `--ctrl-hover-shadow` | `none` |
| | `--ctrl-active-shadow` | `none` |
| `.ui-control-link` | `--ctrl-hover-shadow` | `0 0 12px rgba(125, 213, 240, 0.35)` |
| `.settings-select`, `.space-select-button` | `--ctrl-hover-shadow` | Complex inset + outer glow (see `control-states.css:93–96`) |

### 7.4 Do / Don't

- **Do** use `.ui-control-*` classes for new buttons — they automatically get all states
- **Do** use `cursor: var(--cursor-pointer)` (already set by `control-states.css`)
- **Don't** write custom `:hover`/`:active`/`:disabled` styles unless the button has a unique visual identity
- **Don't** use border-radius above 4px on buttons (exception: pills use `--radius-pill`)
- **Don't** use drop shadows on buttons — use glow effects only

---

## 8. Cards & Kacheln

**Source:** `modules/desktop/ui-angular/src/app/spatial-nav.css`

### 8.1 Card Variants

| Class | Content | Size | Special features |
|---|---|---|---|
| `.sn-card` | Generic data display | Auto | Base card — all others inherit |
| `.sn-ship-card` | Ship visual + name + stats | 240px+ | 100px visual area, manufacturer label, stats row, `:hover → translateY(-2px)` |
| `.sn-member-card` | Avatar + name + role + status | Auto | 36px avatar circle, status dot, flex layout |
| `.sn-erkul-slot` | Equipment slot info | 200px+ | Label + name + size, 10px/12px padding |
| `.sn-ops-card` | Operation status | 280px+ | Header + row list, status badges |
| `.system-hints-overview-card` | Health metric | Auto | Label + value + meta, no border |
| `.footer-health-entry` | Module health status | Auto | Head + optional submodules, `--error`/`--warning` variants |

### 8.2 Base Card Anatomy (`.sn-card`)

```css
background: rgba(12, 32, 48, 0.65);
border: 1px solid rgba(82, 193, 230, 0.06);
border-radius: 4px;
```

**Structure:**
```
.sn-card
├── .sn-card__header     (title + optional badge)
├── .sn-card__row         (key/value pair with top border separator)
├── .sn-card__bar         (progress bar track)
│   └── .sn-card__fill    (progress bar fill — color via inline style)
└── .sn-card__badge       (status badge)
```

### 8.3 Card States

| State | Property | Value |
|---|---|---|
| Default | `border-color` | `rgba(82, 193, 230, 0.06)` |
| `:hover` | `border-color` | `rgba(82, 193, 230, 0.15)` |
| Ship card `:hover` | `transform` | `translateY(-2px)` + border lightens |

### 8.4 Status Badges in Cards

| Class | Color | Usage |
|---|---|---|
| `.sn-ops-badge--ok` | Green | Operation healthy |
| `.sn-ops-badge--warn` | Gold | Operation degraded |
| `.sn-ops-badge--err` | Red | Operation failed |

### 8.5 Status Dots

| Class | Color | Glow | Usage |
|---|---|---|---|
| `.sn-status-dot--ok` | `#5fd698` | Yes, green glow | Module/member online |
| `.sn-status-dot--warn` | Gold | — | Degraded/warning state |
| `.sn-status-dot--err` | Red | — | Error/offline state |
| `.sn-status-dot--unknown` | Muted, opacity 0.4 | — | Unknown/not checked |

### 8.6 Do / Don't

- **Do** use `.sn-card` as the base for any new card type
- **Do** keep card backgrounds semi-transparent (`rgba(12, 32, 48, 0.65)`)
- **Don't** use solid opaque backgrounds on cards
- **Don't** add drop shadows to cards — border glow only on hover
- **Don't** exceed 4px border-radius on cards

---

## 9. Navigation

**Source:** `modules/desktop/ui-angular/src/app/spatial-nav.css`, `app.html`

### 9.1 Spatial Navigation System

The app uses a **3×3 grid of full-viewport views**, navigated via mouse gestures on cardinal edge zones.

**Container:** `.spatial-world` — transforms between views via CSS `transform: translate()`

**Views:** `.spatial-view` — each occupies `100vw × 100vh`, only `.active` view has `opacity: 1` and `pointer-events: auto`

### 9.2 Cardinal Nav Zones

| Zone class | Position | Label direction | Glow gradient |
|---|---|---|---|
| `.sn-nav-zone--t` | Top edge | Below icon | Radial from top center |
| `.sn-nav-zone--b` | Bottom edge | Above icon | Radial from bottom center |
| `.sn-nav-zone--l` | Left edge | Right of icon | Radial from left center |
| `.sn-nav-zone--r` | Right edge | Left of icon | Radial from right center |

**Nav zone elements:**
- `.sn-nz-icon` — 18px SVG arrow, opacity 0.18, scales to 1.15 on hover
- `.sn-nz-label` — 7–9px uppercase label, max-width 0 → 120px on hover (reveal animation)
- `::before` pseudo — radial gradient glow behind the zone

### 9.3 Mini-Grid (Long-Press Overlay)

`.sn-mini-grid` — 3×3 grid overlay that appears on long-press, showing all 9 views

| Cell state | Class | Visual |
|---|---|---|
| Current view | `--current` | Cyan border + background tint |
| Hovered view | `--hovered` | Dynamic `--cell-color` with glow box-shadow |
| Default | — | Transparent, subtle border |

### 9.4 Corner Chrome

Four fixed-position corner groups:

| Position | Class | Contains |
|---|---|---|
| Top-left | `.sn-corner--tl` | App logo (22px circle), system hints trigger |
| Top-right | `.sn-corner--tr` | Settings gear, minimize, fullscreen, close buttons |
| Bottom-left | `.sn-corner--bl` | Community link icon |
| Bottom-right | `.sn-corner--br` | Launch game pill, voice pill |

**Corner logo:** `.sn-corner-logo` — 22px circle with radial gradient, teal 0.15 opacity border

**Corner text:** `.sn-corner-text` — 10px uppercase Orbitron, 0.4 opacity

### 9.5 Stagger Animation

When a view becomes active, child elements with `.sn-stagger` animate in sequentially:

```css
@keyframes sn-item-appear — 0.5s ease both
  from: opacity 0, translateY(12px), scale(0.98)
  to: opacity 1, translateY(0), scale(1)
```

Each `.sn-stagger` child gets `animation-delay` based on `--stagger-i` index.

---

## 10. Forms & Controls

**Source:** `modules/desktop/shared/styles/desktop-theme.css`, `control-states.css`

### 10.1 Text Inputs

| Class | Height | Background | Border | Radius | Usage |
|---|---|---|---|---|---|
| `.settings-input` | Auto (8px padding) | `rgba(12, 28, 40, 0.8)` | `1px solid rgba(82, 193, 230, 0.3)` | `--radius-md` (4px) | Settings text fields |
| `.settings-search` | Auto | Same | Same | Same | Search filter in settings |

**States:**
- `:focus-visible` → outline ring (same as buttons)
- Cursor: `var(--cursor-text)` via global cascade

### 10.2 Select / Dropdown

**Source:** `modules/shared/design-system/lib/forms.css`, `modules/desktop/shared/styles/desktop-theme.css`

#### Design system base: `.scc-select`

Shared native `<select>` styling from `forms.css`. Use this for all new `<select>` elements.

- `appearance: none` with custom SVG caret (cyan chevron, 10×6px)
- Background: `var(--surface-panel)`, border: `var(--border-default)`
- Hover: `var(--border-strong)` + `var(--shadow-elevated)`
- Focus: `var(--border-strong)` + `var(--shadow-glow)`
- Disabled: opacity 0.65, `--cursor-default`
- Padding: `var(--space-xs) var(--space-sm)`, right padding 28px for caret

#### Desktop enrichment: `.settings-select`

Extends `.scc-select` with richer gradient backgrounds and glow effects for desktop settings contexts. Both classes can be combined: `class="scc-select settings-select"`.

- Complex radial + linear gradient background
- Rich box-shadow system (inset + outer glow)
- Min-height: 36–48px
- `:hover` and `:focus-visible` complex shadow overrides

#### Custom select: `.space-select`

Fully custom JS-driven dropdown component for setup wizard and complex selection UIs.

- `.space-select-button` — 48px min-height, radial gradient background, rich shadow
- `.space-select-menu` — dropdown with radial gradient, `z-index: 40`
- `.space-select-item` — 12px text, hover = `rgba(26, 83, 118, 0.34)` + `translateY(-1px)`
- `.space-select-item.is-selected` — gradient background + inset shadow

**Space select states:**
| State | Class | Visual change |
|---|---|---|
| Open | `.is-open` | Bright border, glow, button lifts `-1px`, caret rotates 180° |
| Empty | `.is-empty` | Dashed gold border, warm radial gradient |
| Single option | `.is-single-option` | Green-tinted border |
| Disabled | `.is-disabled` | Opacity 0.55, `--cursor-default` |
| Auto-disabled | `.is-auto-disabled` | `--cursor-default` (no opacity change) |

#### Custom dropdown: `.scc-dropdown`

**Source:** `modules/shared/design-system/lib/forms.css`

JS-driven dropdown with trigger button, floating menu, and items. Use for custom dropdowns where native `<select>` is insufficient (icons, metadata, complex option rendering).

```
.scc-dropdown
├── button.scc-dropdown-trigger
│   ├── span.scc-dropdown-icon      (optional, 18px icon)
│   ├── span.scc-dropdown-value     (label, truncates with ellipsis)
│   │   └── span.scc-dropdown-meta  (optional, secondary text)
│   └── span.scc-dropdown-caret     (CSS chevron, rotates on open)
└── div.scc-dropdown-menu
    ├── button.scc-dropdown-item
    │   ├── span.scc-dropdown-icon  (optional)
    │   └── span.scc-dropdown-meta  (optional)
    └── ...
```

**Trigger:** 42px min-height, gradient background, 0.32 cyan border, inset highlight + outer glow.

**Menu:** Absolute positioned, `z-index: 50`, max-height `min(280px, 45vh)`, reveal animation 0.15s.

**Item hover:** `rgba(82, 193, 230, 0.12)` background. Selected: 600 weight, accent color, 2px cyan left bar.

**Dropdown states:**
| State | Class | Visual change |
|---|---|---|
| Open | `.is-open` | Menu visible, caret rotates 180°, trigger border brightens |
| Placeholder | `.is-placeholder` | Dashed trigger border, italic hint text |
| Single entry | `.is-single` | Non-interactive trigger, muted border |
| Static trigger | `.is-static` | Non-interactive, no hover effect |
| Disabled | `.is-disabled` | Opacity 0.5, default cursor |

### 10.3 Toggle Switch

```
.toggle
├── input[type="checkbox"] (hidden)
└── .toggle-track (32×16px pill)
    └── ::after (10px thumb circle)
```

| State | Track | Thumb |
|---|---|---|
| Off | `rgba(82, 193, 230, 0.12)` | Left position |
| On (`:checked`) | `rgba(82, 193, 230, 0.35)` | Right position (`translateX(16px)`) |
| Hover | Border + shadow glow | — |
| Active | `translateY(1px)` + inset shadow | — |
| Focus-visible | Outline ring + double box-shadow | — |
| Disabled | Opacity 0.65, `--cursor-default` | — |

### 10.4 Status Value Display

`.settings-value` — read-only value display (not editable):
- Radial gradient background
- 1px cyan-tinted border
- `.is-muted` variant: dashed border, muted text color

### 10.5 Sparse Badge (in selects)

| Class | Border | Text | Background | Context |
|---|---|---|---|---|
| `.space-select-sparse-badge` | Cyan 0.32 | Light cyan | Cyan 0.12 | Default badge |
| `.space-select-sparse-badge.is-empty` | Gold 0.44 | Warm gold | Gold 0.16 | No items available |
| `.space-select-sparse-badge.is-single` | Green 0.45 | Light green | Green 0.14 | Single item only |

---

## 11. Scrollbars

**Source:** `modules/shared/design-system/lib/app-scrollbars.css`

### 11.1 Custom Scrollbar Tokens

| Token | Value | Usage |
|---|---|---|
| `--app-scrollbar-size` | `10px` | Width (vertical) / height (horizontal) |
| `--app-scrollbar-gap` | `4px` | Gap from container edge |
| `--app-scrollbar-radius` | `2px` | Track and thumb rounding |
| `--app-scrollbar-thumb-min-size` | `36px` | Minimum thumb length |
| `--app-scrollbar-track` | `rgba(6, 18, 28, 0.08)` | Track background (hidden) |
| `--app-scrollbar-track-visible` | `rgba(6, 18, 28, 0.2)` | Track background (on hover) |
| `--app-scrollbar-thumb-idle` | `rgba(164, 223, 242, 0.34)` | Thumb resting |
| `--app-scrollbar-thumb-hover` | `rgba(164, 223, 242, 0.52)` | Thumb hovered |
| `--app-scrollbar-thumb-active` | `rgba(164, 223, 242, 0.72)` | Thumb dragging |
| `--app-scrollbar-shadow` | `inset 0 0 0 1px rgba(193, 240, 252, 0.1)` | Thumb inner border |

### 11.2 Scrollbar Behavior

- **Hidden by default** — scrollbar appears only when container is hovered or actively scrolling
- **Custom implementation** — native scrollbars are fully hidden (`.app-custom-scroll-host`)
- **Ornamental variant** — `.ornamental-scroll-surface` hides scrollbar entirely
- Cursor on scrollbar: always `var(--cursor-default)` (not pointer)
- Transition: `opacity 0.18s ease`

See [`scrollbar-visibility-guidelines.md`](scrollbar-visibility-guidelines.md) for full behavior rules.

---

## 12. Animations & Transitions

**Source:** `modules/shared/design-system/lib/logo-animations.css`, component CSS files

### 12.1 Logo Animation System

The logo animation system (`logo-animations.css`) provides GPU-accelerated animations organized by category. All animations use `transform`, `opacity`, and `filter` only — never layout-triggering properties.

**Speed control:** `--logo-speed: 1` (global multiplier)

### 12.2 Living/Breathing Animations

| Class | Timing | Easing | Visual | Usage |
|---|---|---|---|---|
| `.life-breathe` | `4s` | `cubic-bezier(0.45, 0.05, 0.55, 0.95)` | Scale 1.0→1.048→1.0, opacity 0.82→1.0→0.82 | Core logo breathing, idle state |
| `.life-heartbeat` | `1.6s` | `ease-out` | Double-thump scale (S1: 1.10, S2: 1.05, rest) | Active/processing state |
| `.life-awareness` | `8s` | — | Subtle positional drift, uneven keyframes | Ambient "alive" feel |

### 12.3 Orbital Animations

| Class | Timing | Visual | Usage |
|---|---|---|---|
| `.orbit-slow` | `20s` | Full rotation | Background orbital rings |
| `.orbit-medium` | `12s` | Full rotation | Mid-layer orbital elements |
| `.orbit-fast` | `8s` | Full rotation | Inner orbital elements |
| `.orbit-drift` | `30s` | Slow rotation | Outer nebula drift |

### 12.4 Glow Effects

| Class | Timing | Visual | Usage |
|---|---|---|---|
| `.glow-pulse` | `3s` | Opacity/filter pulse | Standard glow cycle |
| `.glow-surge` | `0.8s` | Quick brightness burst | Notification/event trigger |
| `.glow-warm` | `2.4s` | Warm color shift | Gold-themed glow |
| `.glow-fade` | `3s` | Slow fade out | Dismissal/sleep transition |
| `.glow-gold` | — | Gold color filter | Companion/gold state |
| `.glow-danger` | — | Red color filter | Error state |

### 12.5 State Transitions

| Class | Visual | Usage |
|---|---|---|
| `.state-wake` | Fade in + scale up | App coming online |
| `.state-sleep` | Fade out + scale down | App going idle |
| `.state-alert` | Flash/shake | Notification alert |
| `.state-error` | Red pulse | Error state |

### 12.6 Tray Icon Animations

| Class | Timing | Visual | Context |
|---|---|---|---|
| `.tray-spin` | `1.2s` | Full rotation | Processing/busy tray state |
| `.tray-pulse` | `2.6s` | Opacity pulse | Idle/standby tray state |
| `.tray-alert-pulse` | `1.4s` | Alert flash | Notification in tray |
| `.tray-error-flash` | `0.6s` | Rapid red flash | Error in tray |

### 12.7 Particle & Data Animations

| Class | Timing | Visual |
|---|---|---|
| `.particle-float` | `12s` | Floating particle movement |
| `.particle-twinkle` | `3s` | Star-like twinkle |
| `.data-stream` | `2s` | Data flow line animation |

### 12.8 Structural Animations

| Class | Timing | Visual |
|---|---|---|
| `.ring-breathe` | `3s` | Ring scale/opacity breathe (synced with `.scc-reveal`) |
| `.scc-reveal` | `3s` | Logo reveal animation (synced with `.ring-breathe`) |
| `.node-pulse` | `2s` | Node point pulse |
| `.hover-excite` | — | On `:hover`, speeds up child orbits, ring-breathe, data-stream |

### 12.9 Utility

| Class | Effect |
|---|---|
| `.logo-animations-paused` | Freezes all animations (`animation-play-state: paused`) |

### 12.10 UI Transition Standards

| Context | Duration | Easing | Property |
|---|---|---|---|
| Button/control states | `0.2s` | `ease` | `color, background-color, border-color, box-shadow` |
| Button press | `0.12s` | `ease` | `transform` |
| Scrollbar fade | `0.18s` | `ease` | `opacity, background-color` |
| Select open/close | `0.18s` | `ease` | `border-color, box-shadow, background, transform` |
| Select menu reveal | `0.14s` | `ease-out` | `opacity, transform` |
| Spatial view slide | `420ms` | `ease-out` | `opacity, transform` (via `slide-in`) |
| Stagger item appear | `0.5s` | `ease` | `opacity, transform` |
| Loading splash fade | `260ms` | — | `opacity, transform, filter` |
| Loading splash exit | `420ms` | — | `opacity, transform, filter` (with blur) |
| Loading text shimmer | `3.2s` | `linear` | `background-position` |
| Caret pulse | `1.1s` | — | `opacity, transform` |

### 12.11 Loading Progress Animations

**Source:** `modules/loading/ui-angular/src/assets/loading-progress.css`

The loading screen uses `@property --progress` registration to animate a CSS custom property driving SVG `stroke-dashoffset` arcs.

| Animation | Trigger | Duration | Easing | Visual |
|---|---|---|---|---|
| `sccChargeUp` | `.is-charging` class on init | 2200ms | `cubic-bezier(0.22, 1, 0.36, 1)` | `--progress` ramps 0 → 0.60 |
| `sccProgressPulse` | `.is-indeterminate` class | 1600ms | `ease-in-out` infinite | Opacity breathe 0.55 → 1.0 on a 25% arc |
| `sccProgressComplete` | `.is-complete` class | 800ms (400ms delay) | `ease-out` | Stroke goes gold + `drop-shadow` glow |
| `sccStatusReveal` | Always (1000ms delay) | 400ms | `ease-out` | Status text fades in + slides up |

**`@property` registration:** Required for animating `--progress` as a `<number>`. This is a modern CSS feature (Chromium 85+, Electron 20+) — safe for this app's targets.

**Reduced motion:** All decorative animations are disabled under `prefers-reduced-motion: reduce`; the progress arc remains functional (it's informational).

### 12.12 Do / Don't

- **Do** use `transform` and `opacity` for animations — GPU-accelerated
- **Do** use `will-change` for animated elements
- **Don't** animate `width`, `height`, `top`, `left`, `margin`, `padding` — triggers layout
- **Don't** use bouncy/playful easings — keep it technical/mechanical
- **Don't** use spinners — prefer scan-line or progress bar animations

---

## 13. Icons, Logos & Brand Assets

### 13.1 App Logo

| Asset | Path | Format | Context |
|---|---|---|---|
| App Logo (current, v9) | `modules/desktop/resources/app-logo.svg` | SVG | Full vector logo, quantum-nebula brain-core |
| Logo v8 (legacy) | `assets/logo-v8-c.svg` | SVG | Kept for reference, not actively used |
| Loading Logo (minimal) | `modules/loading/ui-angular/src/assets/logo-loading-minimal.svg` | SVG | Splash/loading screen |
| Loading Logo (full) | `modules/loading/ui-angular/src/assets/logo-loading-full.svg` | SVG | Full loading variant |

### 13.2 App Icons (Window / Taskbar)

| Asset | Path | Size | Context |
|---|---|---|---|
| `app-icon.png` | `modules/desktop/resources/app-icon.png` | 256px | Electron BrowserWindow icon, Angular UI header |
| `app-icon.ico` | `modules/desktop/resources/icons/app-icon.ico` | Multi-res | Windows taskbar/explorer icon |
| `app-icon-16.png` | `modules/desktop/resources/icons/app-icon-16.png` | 16px | Small icon contexts |
| `app-icon-32.png` | `modules/desktop/resources/icons/app-icon-32.png` | 32px | Standard icon |
| `app-icon-48.png` | `modules/desktop/resources/icons/app-icon-48.png` | 48px | Medium icon |
| `app-icon-128.png` | `modules/desktop/resources/icons/app-icon-128.png` | 128px | Large icon |
| `app-icon-256.png` | `modules/desktop/resources/icons/app-icon-256.png` | 256px | High-res icon |

### 13.3 Installer Icon

| Asset | Path | Context |
|---|---|---|
| `icon.ico` | `installer/SccInstaller/icon.ico` | Electron-builder, ow-electron branding via `scripts/brand-ow-electron.js` |

### 13.4 System Tray Icons (12 states)

All at `modules/desktop/resources/tray/`, each as both `.png` and `.svg`:

| File stem | State | Visual | When shown |
|---|---|---|---|
| `tray-default` | Default/startup | Standard logo | App starting up |
| `tray-default-glow` | Default + glow | Logo with cyan glow | App ready (initial) |
| `tray-idle` | Idle/standby | Dimmed logo | ow-electron not running |
| `tray-active` | Active/running | Bright logo | ow-electron is running |
| `tray-error` | Error | Red-tinted logo | Error state (available, not yet wired) |
| `tray-notification` | Notification | — | Notification pending (available, not yet wired) |
| `tray-notification-glow` | Notification + glow | Glowing notification | Notification emphasis (available, not yet wired) |
| `tray-processing-f1` | Processing frame 1 | Animated processing | Background task running |
| `tray-processing-f2` | Processing frame 2 | " | " |
| `tray-processing-f3` | Processing frame 3 | " | " |
| `tray-processing-f4` | Processing frame 4 | " | " |

**Tray icon state mapping** (from `modules/desktop/src/main.js`):
```
getTrayIconForState('idle')    → tray-idle.png
getTrayIconForState('active')  → tray-active.png
(default)                      → tray-default.png
(glow)                         → tray-default-glow.png
```

### 13.5 Third-Party Brand Icons

| Asset | Path | Context |
|---|---|---|
| `community-made-white.png` | `modules/desktop/resources/community-made-white.png` | RSI "Community Made" badge |
| `icon-anthropic.svg` | `modules/desktop/resources/icon-anthropic.svg` | AI provider: Anthropic |
| `icon-google.svg` | `modules/desktop/resources/icon-google.svg` | AI provider: Google |
| `icon-openai.svg` | `modules/desktop/resources/icon-openai.svg` | AI provider: OpenAI |

### 13.6 Cursors

Runtime cursors are defined as inline SVG data-URIs in `cursor-tokens.css`. The legacy standalone cursor SVG files (`cursor-default.svg`, `cursor-pointer.svg`, `cursor-text.svg`) have been removed.

### 13.7 Installer UI Logo

The installer (`installer/ui/`) uses a **CSS-only logo** — no image file. It's a glow circle + "SCC" text with `logoPulse` and `logoFloat` animations, plus CSS-drawn checkmark (done state) and exclamation (error state).

### 13.8 Corner Logo (In-App)

`.sn-corner-logo` — 22px circle in the top-left corner:
- Radial gradient from `var(--sn-teal)` center to transparent
- 1px solid `rgba(--sn-teal, 0.15)` border
- Contains app icon image, 18px

---

## 14. Window Surfaces & Backgrounds

**Source:** `modules/shared/design-system/lib/window-surface.css`, `desktop-shell-base.css`

### 14.1 Window Surface

```css
.window-surface {
  background: radial-gradient(220px 160px at 50% 35%, rgba(82, 193, 230, 0.25), transparent 70%),
              rgb(13, 38, 53);
  border: 1px solid rgba(82, 193, 230, 0.25);
  border-radius: 4px;
}
```

### 14.2 App Shell Background

The `.app::before` pseudo-element adds two large radial gradients:
```css
radial-gradient(1200px 800px at 20% 10%, rgba(82, 193, 230, 0.16), transparent 60%),
radial-gradient(900px 700px at 80% 0%, rgba(22, 70, 100, 0.35), transparent 70%)
```

### 14.3 Nebula Canvas

`NebulaCanvasService` paints dynamic nebula clouds and 900 twinkling stars onto a full-screen `<canvas>` behind the spatial nav views. Each of the 9 views has its own spectral color palette for clouds.

### 14.4 Notice Bar

```css
--shell-notice-bg: linear-gradient(120deg, rgba(240, 194, 123, 0.16), rgba(18, 50, 70, 0.85));
--shell-notice-border: 1px solid rgba(240, 194, 123, 0.45);
--shell-notice-shadow: 0 0 0 1px rgba(240, 194, 123, 0.3), 0 0 12px rgba(240, 194, 123, 0.08);
```

---

## 15. Loading & Status Indicators

**Source:** `modules/loading/ui-angular/src/app/loading.component.css`

### 15.1 Loading Screen

| Element | Class | Visual |
|---|---|---|
| Splash container | `.splash` | Full-screen, fade-in 260ms |
| Animated logo | `.sn-loading-wrap` | Logo with `.is-charging` / `.is-indeterminate` states |
| Loading text | `.loading-text` | Shimmer gradient animation (3.2s) |
| Loading subtext | `.loading-subtext` | Muted, 0.5 opacity |
| Typing caret | `.type-caret` | 1.1s pulse animation |
| Spinner | `.status-spinner` | 2px border ring, 1s linear infinite rotate |
| Status panel | `.status-panel` | Grid layout: title, message, progress, actions |
| Exit animation | `splash-transition-out` | 420ms scale + blur |

### 15.2 Status Dots (Reused Across App)

| Class | Size | Color | Glow | Context |
|---|---|---|---|---|
| `.sn-status-dot--ok` | 6px circle | `#5fd698` | Green glow | Module online, health OK |
| `.sn-status-dot--warn` | 6px circle | Gold | — | Degraded, needs attention |
| `.sn-status-dot--err` | 6px circle | Red | — | Error, offline |
| `.sn-status-dot--unknown` | 6px circle | Muted | — (opacity 0.4) | Not checked, unknown state |

### 15.3 Settings Subnav Status

| Token | Value | Context |
|---|---|---|
| `--settings-subnav-status-ok` | `rgba(95, 214, 152, 0.95)` | Settings section healthy |
| `--settings-subnav-status-warning` | `rgba(247, 199, 102, 0.96)` | Settings section needs action |
| `--settings-subnav-status-action-needed` | `rgba(255, 130, 130, 0.95)` | Settings section requires attention |
| `--settings-subnav-status-idle` | `rgba(120, 150, 168, 0.55)` | Settings section not configured |

---

## Appendix A: File Map

| File | Tokens / Patterns defined |
|---|---|
| `modules/shared/design-system/lib/design-tokens.css` | Surface, text, accent, border, radius, shadow, font tokens |
| `modules/shared/design-system/lib/cursor-tokens.css` | 25 cursor SVG data-URIs + 8 wait animation frames + short aliases |
| `modules/shared/design-system/lib/control-states.css` | Universal button/control interactive states |
| `modules/shared/design-system/lib/app-scrollbars.css` | Custom scrollbar tokens and behavior |
| `modules/shared/design-system/lib/logo-animations.css` | Logo animation keyframes and timing tokens |
| `modules/shared/design-system/lib/window-surface.css` | Window surface gradient background |
| `modules/desktop/shared/styles/desktop-theme.css` | Spacing, radius, cursor cascade, input/select/settings styles |
| `modules/desktop/shared/styles/desktop-shell-base.css` | Shell layout tokens, titlebar, notice bar |
| `modules/desktop/ui-angular/src/app/spatial-nav.css` | Spatial nav system, cards, grids, nav zones, corner chrome |
| `modules/desktop/ui-angular/src/app/cursor-animator.service.ts` | Dynamic cursor animations (body sweep, gold dot, wait ring) |
| `modules/desktop/ui-angular/src/app/nebula-canvas.service.ts` | Canvas nebula clouds and star field |
| `modules/loading/ui-angular/src/assets/loading-progress.css` | Loading progress arc, charge-up, complete, and pulse animations |

## Appendix B: Design Principles (RSI-Inspired)

1. **Dark mode only** — no light variants, ever
2. **Sharp edges** — 0–4px border-radius maximum (except pills)
3. **Border glows, not drop shadows** — depth comes from glow, not gravity
4. **Information-dense** — tight spacing, compact layouts, HUD aesthetic
5. **Technical typography** — ALL CAPS labels, tight letter-spacing, Orbitron for headings
6. **Cyan-dominant palette** — primary accent is always cyan, gold is secondary
7. **No native UI** — custom cursors, custom scrollbars, custom selects
8. **GPU-only animation** — transform/opacity/filter only, never layout properties
9. **Subtle interactivity** — hover states are gentle glows, not dramatic color shifts
10. **Scan-line > spinner** — technical loading states, not playful bouncing indicators

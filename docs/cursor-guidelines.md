# Cursor Guidelines

This policy defines **mandatory** cursor usage for the desktop UI.

> **Golden Rule:** The app must NEVER show the native Windows cursor. Every surface, every element, every state must resolve to one of the SCC Sentinel Arrow cursor tokens. If you see a white Windows arrow anywhere in the app, it is a bug.

## Source of Truth

All cursor visuals are defined as SVG data-URI CSS custom properties in:

- `modules/shared/design-system/lib/cursor-tokens.css` — token definitions (SVG arrow shapes, colors, hotspots)
- `modules/desktop/shared/styles/desktop-theme.css` — global cascade rules (which elements get which cursor)
- `modules/desktop/ui-angular/src/app/cursor-animator.service.ts` — JS-driven animated cursor transitions

Do not hardcode cursor literals (`cursor: pointer;`, `cursor: default;`, `cursor: wait;`) or direct `url(...)` cursors in feature styles. Always use the token variables.

## Token Reference

| Token | Visual | When to use |
|-------|--------|-------------|
| `--cursor-default` | Sentinel arrow, dark RSI blue (#1e6a82) | Non-interactive areas, backgrounds, structural elements, disabled states |
| `--cursor-pointer` | Sentinel arrow, bright cyan (#52c1e6) | All clickable/interactive elements (see element list below) |
| `--cursor-gold` | Sentinel arrow, CIG gold (#f0d060) with glow dot | Active/pressed state — applied dynamically by CursorAnimatorService |
| `--cursor-text` | Cyan I-beam | Text input fields, text areas, contenteditable |
| `--cursor-wait` | Quantum ring animation (8 frames) | Blocking operations — animated by CursorAnimatorService |
| `--cursor-progress` | Sentinel arrow + loading ring badge | Background operations (non-blocking) |
| `--cursor-not-allowed` | Red sentinel arrow with ✕ | Forbidden actions, permission denied |
| `--cursor-no-drop` | Sentinel arrow with ✕ badge | Invalid drop target during drag |
| `--cursor-grab` | Open hand (RSI teal) | Draggable element at rest |
| `--cursor-grabbing` | Closed hand (RSI teal) | Element being dragged |
| `--cursor-move` | 4-directional arrow (RSI teal) | Movable/repositionable element |
| `--cursor-crosshair` | Cyan crosshair | Precision selection |
| `--cursor-help` | Sentinel arrow + ? badge | Help/info triggers |
| Resize tokens | Directional arrows | Resizable edges/handles |

## Color Palette

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Dark RSI | `#1e6a82` | `rgb(30, 106, 130)` | Default/resting state, body gradient dark end |
| Bright Cyan | `#52c1e6` | `rgb(82, 193, 230)` | Hover/pointer state, body gradient bright end |
| CIG Gold Hot | `#f0d060` | `rgb(240, 208, 96)` | Click/active state, dot flash, sweep tip |
| CIG Gold | `#b8952e` | `rgb(184, 149, 46)` | Click/active state, sweep body, glow |
| Red | `#c0392b` | `rgb(192, 57, 43)` | Forbidden/not-allowed |
| Hull BG | `#0d2635` | | Wait cursor background fill |

## Element → Cursor Mapping

### Interactive elements → `--cursor-pointer`

Applied automatically by `desktop-theme.css`:

```css
a, button, select, label, summary,
[role="button"], [role="tab"], [role="link"], [role="menuitem"],
[tabindex]:not([tabindex="-1"]),
.settings-link, .settings-select, .settings-toggle,
.carousel-dot, .scatter-tile, .edge-nav-zone
```

All components inheriting from these elements get `--cursor-pointer` automatically. No per-component cursor rules needed.

### Non-interactive surfaces → `--cursor-default`

Set on `html, body` and inherited by all elements via `cursor: inherit`. Elements that are NOT in the interactive list above automatically show the dark RSI Sentinel arrow.

**This includes:**
- Empty canvas/background areas
- Structural containers (`.spatial-view`, `.shell-body`, `.content-main`)
- Decorative elements (nebula clouds, stars, separators)
- Static text and labels (non-clickable)

### Text input → `--cursor-text`

```css
input[type="text"], input[type="search"], input[type="email"],
input[type="url"], input[type="number"], input[type="password"],
textarea, [contenteditable="true"]
```

### Disabled states → `--cursor-default`

Every disabled variant must resolve to the dark RSI arrow:
- `:disabled`
- `[aria-disabled="true"]`
- `.is-disabled`, `.disabled`

### Scrollbar pseudo-elements

- Track, corner: inherit from `--cursor-default`
- Thumb (+ hover): `--cursor-pointer`

## Animated Cursor System (CursorAnimatorService)

The cursor is not static — it animates smoothly between states using JS-driven SVG generation. Two independent layers are composited:

### Layer 1: Body Sweep (hover → bright)

| State | Body gradient |
|-------|---------------|
| Idle (not hovering) | Dark RSI → Dark RSI (uniform dark) |
| Hovering interactive element | Dark RSI → Bright Cyan (sweep from tip) |

Transition: 16 frames at 35ms/frame (~560ms). Smooth interpolation.

### Layer 2: Gold Dot + Gold Body (click/drag)

| Interaction | Dot behavior | Body behavior |
|-------------|-------------|---------------|
| **Click** (any interactive element) | Gold dot appears at arrow tip, grows to r=2.2, pulses | Body stays cyan — no gold tint |
| **Quick click** (< 350ms) | Gold dot flashes (r=3.2), then fades out | Body stays cyan |
| **Click + hold** (non-drag) | Gold dot pulses at r≈2.2 | Body stays cyan while held |
| **Drag hold** (draggable / scatter-tile) | Gold dot grows → full gold sweep from tip downward | Body transitions fully to gold over 24 frames |
| **Release after drag** | Gold recedes, dot shrinks | Body transitions back from gold to cyan/dark |

**Key rule:** Only the gold dot at the arrow tip signals a click. The entire cursor body turns gold **only** for drag-and-drop elements (`draggable` attribute or `.scatter-tile` class) and text drag operations. This distinction helps the user immediately recognize when an element supports dragging.

### Wait Animation

8-frame quantum ring animation at 120ms intervals. Applied per-element via `startWait(el)` / `stopWait(el)`.

### Drag detection

An element is considered a drag target **only** if:
- It has the `draggable` attribute set to `true`

Only drag targets trigger the full gold body sweep. All other interactive elements — including `.scatter-tile` tiles, buttons, links, nav items — are treated as click targets and show only the gold dot at the arrow tip.

**Not drag targets** (common mistake): `.scatter-tile` (version tiles, video tiles, community tiles) are clickable cards, not draggable. They must use the click cursor behavior (gold dot only).

## CSS Utility Classes

| Class | Cursor |
|-------|--------|
| `.cursor-default` | `var(--cursor-default)` |
| `.cursor-pointer` | `inherit` (from themed parent) |
| `.cursor-text` | `inherit` (from themed parent) |

Use these only for edge-case overrides within components.

## UI Element → Cursor Behavior Reference

Use this table when creating new components to determine the correct cursor behavior:

| Element type | Examples | Cursor token | Click animation |
|-------------|----------|-------------|-----------------|
| **Buttons** | `<button>`, `[role="button"]`, `.settings-toggle` | `--cursor-pointer` (auto) | Gold dot at tip only |
| **Links** | `<a>`, `[role="link"]`, `.settings-link` | `--cursor-pointer` (auto) | Gold dot at tip only |
| **Navigation items** | `[role="tab"]`, `[role="menuitem"]`, `.edge-nav-zone` | `--cursor-pointer` (auto) | Gold dot at tip only |
| **Cards / Tiles** | `.scatter-tile`, `.scatter-tile--media`, `.scatter-tile--version` | `--cursor-pointer` (auto) | Gold dot at tip only |
| **Select / Dropdown** | `<select>`, `.settings-select` | `--cursor-pointer` (auto) | Gold dot at tip only |
| **Carousel indicators** | `.carousel-dot` | `--cursor-pointer` (auto) | Gold dot at tip only |
| **Custom interactive** | `[tabindex]:not([tabindex="-1"])` | `--cursor-pointer` (auto) | Gold dot at tip only |
| **Draggable elements** | `[draggable="true"]` | `--cursor-pointer` (auto) | Full gold body sweep |
| **Text input** | `<input type="text">`, `<textarea>`, `[contenteditable]` | `--cursor-text` (auto) | N/A |
| **Disabled elements** | `:disabled`, `[aria-disabled="true"]` | `--cursor-default` (auto) | None |
| **Non-interactive** | Backgrounds, containers, static text, decorative | `--cursor-default` (inherited) | None |

**Key distinction:** Almost every interactive element gets **gold dot only** on click. The **full gold body sweep** is reserved exclusively for elements with `draggable="true"`. This visual distinction helps users recognize drag-and-drop affordances instantly.

## Adding New Components

When adding a new interactive component:

1. **Do NOT add `cursor: pointer`** — if your element is a `button`, `a`, `[role="button"]`, or matches the interactive selector, it gets `--cursor-pointer` automatically.
2. **Do NOT add `cursor: default`** — if your element is not interactive, it inherits `--cursor-default` from the body.
3. **If your element is custom** (e.g., a div acting as a button), add `role="button"` or `tabindex="0"` — this is the correct semantic approach and automatically gets the right cursor.
4. **If your element is draggable**, add the `draggable="true"` attribute to get the gold body sweep animation on hold. Do NOT use `.scatter-tile` for drag detection — that class is for card layout only.
5. **Use `cursor: var(--cursor-pointer, pointer)` as fallback** only in standalone CSS files that might render outside the theme context (e.g., `spatial-nav.css`). The `, pointer` fallback ensures graceful degradation.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `cursor: default` | Use `cursor: var(--cursor-default)` |
| `cursor: pointer` | Use `cursor: var(--cursor-pointer)` or rely on theme cascade |
| `cursor: wait` | Use `CursorAnimatorService.startWait(el)` |
| `cursor: url(...)` | Define in `cursor-tokens.css`, reference via `var(--cursor-...)` |
| Windows cursor visible on empty area | Ensure the element inherits from `body` which has `--cursor-default` |
| Gold sweep on regular click | Check drag detection — only `draggable` and `.scatter-tile` trigger sweep |

## CI Enforcement

`npm run lint:cursor-policy` blocks non-token `cursor: pointer;` and `cursor: default;` declarations outside the cursor token source file.

## File Map

| File | Purpose |
|------|---------|
| `modules/shared/design-system/lib/cursor-tokens.css` | SVG cursor definitions as CSS custom properties |
| `modules/desktop/shared/styles/desktop-theme.css` | Global cascade: which elements get which cursor token |
| `modules/desktop/ui-angular/src/app/cursor-animator.service.ts` | JS animation engine (body sweep, gold dot, wait ring) |
| `scripts/check-cursor-policy.js` | CI lint script |

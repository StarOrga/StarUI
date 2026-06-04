# Star Citizen Companion — Design System

> **Professional name:** Design System (also: UI Kit, Component Library)
>
> This document is the **canonical reference** for every visual element, component, pattern,
> and interaction in the Star Citizen Companion. It covers all three UI surfaces:
> **Desktop App** (leading), **Loading Screen**, and **Installer**.
>
> For low-level token values (hex codes, pixel values, CSS variables), see the
> [Visual Style Guide](STYLEGUIDE.md). This document focuses on **what exists**,
> **how components behave**, and **where gaps remain**.

**Companion documents:**
- [`STYLEGUIDE.md`](STYLEGUIDE.md) — Token values, color system, typography scale, spacing
- [`design-token-layer.md`](design-token-layer.md) — 4-layer token architecture
- [`cursor-guidelines.md`](cursor-guidelines.md) — Cursor policy & CI lint rules
- [`radius-guidelines.md`](radius-guidelines.md) — Radius scale (max 4px, RSI sharp-edges)
- [`scrollbar-visibility-guidelines.md`](scrollbar-visibility-guidelines.md) — Scrollbar behavior
- [`settings-cloud-compass.md`](settings-cloud-compass.md) — Cloud Compass navigation pattern

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Foundations](#2-foundations)
3. [Component Catalog](#3-component-catalog)
4. [Patterns & Layouts](#4-patterns--layouts)
5. [Motion & Animation](#5-motion--animation)
6. [Accessibility](#6-accessibility)
7. [Brand Assets](#7-brand-assets)
8. [Cross-Surface Matrix](#8-cross-surface-matrix)
9. [Gap Analysis & Roadmap](#9-gap-analysis--roadmap)

---

## 1. Design Principles

These five principles guide every visual decision across all SCC surfaces.

### 1.1 RSI-Inspired, Not RSI-Copied

The visual language draws from Star Citizen's universe — dark space environments, cyan holographic interfaces, gold accents — without directly copying RSI's UI. Every element should feel like it belongs in the same universe while being distinctly SCC.

### 1.2 Sharp Edges, No Softness

All radii cap at **4px** (`--radius-md`). No rounded pills, no soft cards. This matches RSI's military/industrial aesthetic. See [`radius-guidelines.md`](radius-guidelines.md).

### 1.3 Glows Over Shadows

Elevation is expressed through **border glows** (cyan `box-shadow`), never through traditional drop shadows. Depth comes from opacity and border brightness, not vertical offset.

### 1.4 Restraint in Motion

Animations serve function (loading feedback, state transitions, spatial orientation) — never decoration. GPU-safe properties only (`transform`, `opacity`, `filter`). Duration sweet spot: 0.15–0.3s for micro-interactions, 0.5–1s for page transitions.

### 1.5 Information Density

SC players expect data-rich interfaces. Favor density over whitespace — but ensure every element has clear visual hierarchy through the typography and color system.

---

## 2. Foundations

Foundations are the atomic building blocks. Full token values live in the [Style Guide](STYLEGUIDE.md); this section maps the **system** and **relationships**.

### 2.1 Color System

**Source:** `modules/shared/design-system/lib/design-tokens.css`

| Layer | Tokens | Purpose |
|-------|--------|---------|
| **Surfaces** | `--surface-canvas`, `-canvas-alt`, `-panel`, `-panel-strong`, `-overlay` | Background hierarchy (dark → darker) |
| **Text** | `--text-primary`, `-secondary`, `-inverse` | Readability on dark surfaces |
| **Accents** | `--accent-primary` (cyan), `-gold`, `-success`, `-warning`, `-danger` | Interactive states & semantics |
| **Borders** | `--border-subtle`, `-default`, `-strong` | Edge definition (all cyan-based rgba) |
| **Spatial Nav** | 6 category colors (red, purple, gold, warm, teal, blue) | Cloud Compass category identification |

**Semantic color usage rules:**
- Cyan = interactive, primary actions, links, focused states
- Gold = companion/AI features, premium feel, secondary actions
- Success green = health OK, verified, ready
- Warning amber = needs attention, community content
- Danger red = errors, destructive actions, close buttons
- Never use raw hex — always reference tokens

### 2.2 Typography

**Source:** `modules/shared/design-system/lib/design-tokens.css` → `--font-*` tokens

| Family | Token | Role | Ratio | Weights |
|--------|-------|------|-------|---------|
| **Inter** | `--font-body-text` | Body, labels, descriptions, input values | 60% | 400, 500, 600, 700 |
| **Orbitron** | `--font-heading-category` | Headings, nav labels, page titles, badges | 30% | 400, 500, 600, 700 |
| **Caveat** | `--font-handwritten-accent` | Attribution text only ("Community Made By") | 10% | 400–700 |

**Type scale (design targets):**

| Element | Font | Size | Weight | Letter-spacing | Transform |
|---------|------|------|--------|----------------|-----------|
| Page title | Orbitron | 16–20px | 600 | 0.08–0.12em | uppercase |
| Section heading | Orbitron | 13–15px | 600 | 0.06–0.10em | uppercase |
| Nav zone label | Orbitron | 7–9px | 600 | 0.14em | uppercase |
| Button / badge | Inter | 9–12px | 500–600 | 0.08–0.16em | uppercase |
| Body text | Inter | 12–13px | 400 | 0.01–0.025em | none |
| Caption / muted | Inter | 10–11px | 400 | 0.02em | none |
| Attribution | Caveat | 12–14px | 400 | 0 | none |
| Titlebar | Orbitron | 14px | 500 | 0.12em | none |

### 2.3 Spacing

**Source:** `modules/desktop/shared/styles/desktop-theme.css`

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `clamp(8px, 0.55vw, 10px)` | Tight gaps, icon padding |
| `--space-sm` | `clamp(10px, 0.75vw, 14px)` | Label gaps, inline spacing |
| `--space-md` | `clamp(14px, 1vw, 18px)` | Panel padding, section gaps |
| `--space-lg` | `clamp(18px, 1.4vw, 24px)` | Page margins, major sections |

All spacing uses `clamp()` for responsive scaling. No fixed pixel values for layout spacing.

### 2.4 Borders & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `2px` | Small controls, badges |
| `--radius-md` | `4px` | Cards, panels, inputs — **maximum radius** |
| `--radius-lg` | `4px` | Same as md — intentionally capped |
| `--radius-xl` | `4px` | Same as md — intentionally capped |

**Rule:** Never use `border-radius` > 4px. No pills, no circles (except status dots and icons).

### 2.5 Shadows & Elevation

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-soft` | `0 0 0 1px rgba(82,193,230,0.2)` | Resting card outline |
| `--shadow-elevated` | `0 0 0 1px ... , 0 0 12px ...` | Hover/raised state |
| `--shadow-glow` | `0 0 16px rgba(82,193,230,0.25)` | Strong emphasis, focus |

**Rule:** All shadows are **border glows** (no `Y-offset`). Traditional drop-shadows (`0 4px 8px ...`) are banned.

### 2.6 Cursors

**Source:** `modules/shared/design-system/lib/cursor-tokens.css` (27 KB)

Custom **Sentinel Arrow** cursor system with 15+ states. Each cursor is an inline SVG data URI with gradient fills matching the SCC color palette.

| Cursor | Token | Visual | Usage |
|--------|-------|--------|-------|
| Default | `--scc-cursor-default` | Dark RSI-blue arrow | Resting, non-interactive areas |
| Pointer | `--scc-cursor-pointer` | Bright cyan arrow | Buttons, links, clickable elements |
| Active/Held | `--scc-cursor-gold` | Gold arrow + glow dot | Mouse-down / dragging |
| Text | `--scc-cursor-text` | Cyan I-beam | Text inputs, editable areas |
| Wait | `--scc-cursor-wait` | Quantum ring (animated) | Blocking operations |
| Progress | `--scc-cursor-progress` | Arrow + loading ring | Background operations |
| Not-allowed | `--scc-cursor-not-allowed` | Red prohibition | Disabled elements |
| Grab | `--scc-cursor-grab` | Open docking clamp | Draggable elements |
| Grabbing | `--scc-cursor-grabbing` | Closed clamp (gold) | Actively dragging |
| Copy | `--scc-cursor-copy` | Arrow + cyan plus | Copy-drag |
| Move | `--scc-cursor-move` | 4-direction arrows | Move/reorder |
| Resize (6 variants) | `--scc-cursor-*-resize` | Directional arrows | Edge/corner resize |

See [`cursor-guidelines.md`](cursor-guidelines.md) for mandatory element-to-cursor mapping.

---

## 3. Component Catalog

Every UI component in the SCC ecosystem, organized by function. Each entry lists: **variants**, **states**, **CSS class**, **source file**, and which **surfaces** use it.

### 3.1 Buttons

**Source:** `modules/shared/design-system/lib/control-states.css`

| Variant | CSS Class | Visual | Usage |
|---------|-----------|--------|-------|
| **Primary** | `.ui-control-primary` | Transparent bg, cyan border, strong hover glow | Main actions (Install, Save, Send) |
| **Secondary** | `.ui-control-secondary` | Transparent bg, subtle border, panel-bg hover | Secondary actions (Browse, Cancel) |
| **Icon** | `.ui-control-icon` | No border, transparent bg, panel-bg hover | Toolbar actions (close, minimize, settings) |
| **Link** | `.ui-control-link` | No border/bg, text-only, underline hover | Inline text actions, navigation links |

**States (all variants):**

| State | Visual change |
|-------|---------------|
| **Default** | Base appearance |
| **Hover** | `border-color` brightens, `box-shadow` glow appears, text brightens |
| **Active** | `translateY(1px)`, inset shadow |
| **Focus-visible** | `2px solid` cyan outline, `2px` offset, contrast ring + glow |
| **Disabled** | `opacity: 0.65`, muted text/border, `pointer-events: none` |

**Transition:** `color, background-color, border-color, box-shadow` at `0.2s ease`, `transform` at `0.12s ease`

**Special button patterns:**
- **Danger button** — not a separate class; uses `--accent-danger` override on `.ui-control-primary`
- **Toggle button** — uses `.space-select-button` with `is-disabled` parent class
- **Navigation button** — carousel prev/next with `‹` / `›` glyphs

### 3.2 Form Controls

#### Text Inputs

| Property | Value |
|----------|-------|
| Background | `--surface-panel` or transparent |
| Border | `1px solid var(--border-default)` |
| Border (focus) | `var(--border-strong)` + `--shadow-glow` |
| Text color | `--text-primary` |
| Placeholder | `--text-secondary` at lower opacity |
| Font | Inter, 12–13px, 400 |
| Padding | `var(--space-xs) var(--space-sm)` |
| Radius | `var(--radius-md)` (4px) |
| Cursor | `var(--scc-cursor-text)` |

**Surfaces:** Desktop (settings, test prompt, metadata), Installer (path input)

#### Select / Dropdown

| Property | Value |
|----------|-------|
| CSS class | `.settings-select` |
| Background | `--surface-panel` |
| Border | `1px solid var(--border-default)` |
| Hover | Strong glow (`inset` + `0 0 20px` cyan) |
| Active | Reduced glow |
| Focus | Triple-ring system (contrast + glow + inset) |
| Caret | Custom cyan SVG arrow |

**Behavior:** See [`desktop-dropdown-behavior.md`](desktop-dropdown-behavior.md) for position logic.

#### Checkbox

| State | Visual |
|-------|--------|
| Unchecked | Empty box, `--border-default` |
| Checked | Cyan fill, check mark |
| Disabled | `opacity: 0.65` |

**Used in:** Language filters (10 options), installer "Launch after install"

#### Toggle Switch

| Property | Value |
|----------|-------|
| CSS class | `.toggle` + `.toggle-track` |
| Off | Dark track, left-positioned thumb |
| On | Cyan track, right-positioned thumb |
| Hover | Border brightens, glow appears |
| Active | `translateY(1px)` |
| Disabled | `opacity: 0.65` |

**Used in:** AI enabled, AI listening, settings toggles

#### Password Input

Used for API key fields. Same as text input but with `type="password"` and clear/verify action buttons.

### 3.3 Cards & Panels

| Variant | CSS / Pattern | Visual | Usage |
|---------|---------------|--------|-------|
| **Standard panel** | `--surface-panel` bg + `--border-subtle` | Dark panel, thin border | Settings sections, status groups |
| **Strong panel** | `--surface-panel-strong` bg + `--border-default` | Brighter panel, visible border | Active/selected panels, expanded sections |
| **Overlay panel** | `--surface-overlay` bg (95% opacity) | Semi-transparent dark | Dropdowns, floating menus |
| **Window surface** | `.window-surface` | `--surface-canvas` + border + radius | Top-level window container |
| **Companion panel** | Custom component | Floating overlay with grid rows | Status display (desktop host shell) |
| **Filters panel** | Custom component | Sidebar with checkboxes + chips | Language filter configuration |

**Card states:**
- Resting: `--shadow-soft` (1px outline)
- Hover: `--shadow-elevated` (outline + 12px glow)
- Selected/Active: `--surface-panel-strong` + `--border-strong`

**Scatter Tile (Verse News)**

Full-bleed 16:9 image tile used in the Verse News scatter layout. Image fills the entire tile, info overlays the bottom via gradient.

| Element | CSS | Notes |
|---------|-----|-------|
| **Container** | `.scatter-tile` | `position: absolute`, sized by layout service (`tileW × tileH`) |
| **Visual** | `.scatter-tile__visual` | `aspect-ratio: 16/9`, `overflow: hidden`, holds image + gradient + overlay |
| **Image filter** | `--scatter-tile-img-filter` | `saturate(0.45) brightness(0.75)` — desaturate + dim to reduce visual noise |
| **Image hover** | `--scatter-tile-img-filter-hover` | `saturate(0.7) brightness(0.85)` — partially restores on hover |
| **Gradient** | `--scatter-tile-overlay-gradient` (via `::after`) | Bottom-heavy gradient for text readability over any thumbnail |
| **Overlay** | `.scatter-tile__overlay` | `position: absolute; bottom: 0` — title + meta with `text-shadow` |
| **Badge** | `.scatter-tile__badge` | LIVE/PTU pill, `position: absolute; top: -4px; left: -4px` |
| **Duration** | `.scatter-tile__duration` | Bottom-right pill over image |

Image treatment uses the Netflix/Spotify pattern: desaturate + dim at rest, partially restore on hover. This ensures consistent visual weight across all thumbnail types (bright, dark, colorful) and keeps the UI accent colors (cyan, gold) dominant.

Variants: `--media` (standard), `--community` (inset shadow), `--live`/`--ptu` (special backgrounds).

Layout algorithm: [`verse-news-scatter-layout.md`](verse-news-scatter-layout.md).

### 3.4 Navigation

| Pattern | Location | Visual |
|---------|----------|--------|
| **Titlebar** | Desktop app top | 36px height, draggable, Orbitron title, min/max/close buttons |
| **Header bar** | Below titlebar | Section title + action buttons |
| **Settings carousel** | Settings pages | Prev/Next arrows + dot indicators |
| **Cloud Compass** | Settings root | 4 category nodes orbiting a nebula cloud (spatial navigation) |
| **Spatial nav** | Settings panels | 6-color zone system with keyboard navigation |
| **Tab-like sections** | Loading status panel | checking/blocked/notice/asset-download modes |

**Cloud Compass navigation** (redesign prototype — leading design):
- 4 category nodes: Game, AI, App, Overlay
- Positioned diagonally at 80% from cloud center
- Click absorption animation (node → cloud)
- Panel spawn: `scale(0.05) → scale(1)` with blur transition
- Color morphing between categories
- Keyboard: Escape to retract
- See [`settings-cloud-compass.md`](settings-cloud-compass.md) for full specification

### 3.5 Tooltips

**Source:** `modules/desktop/ui-angular/src/app/tooltip.directive.ts`

| Property | Value |
|----------|-------|
| Trigger | `mouseenter` / `focusin` on `[appTooltip]`, `[data-tooltip]`, `.has-tooltip` |
| Dismiss | `mouseleave` / `focusout` / `Escape` key |
| Position | Smart — auto-adjusts for viewport bounds |
| Background | `--surface-overlay` |
| Border | `1px solid var(--border-default)` |
| Text | `--text-primary`, Inter, 11–12px |
| Shadow | `--shadow-elevated` |
| Radius | `var(--radius-md)` |
| Delay | None (instant show) |
| Animation | `opacity` fade, 0.15s |

**Accessibility:**
- `role="tooltip"` + `aria-describedby`
- Auto `tabindex` for non-focusable trigger elements
- `MutationObserver` for dynamic attribute changes
- Captures legacy `title` attributes

### 3.6 Modals & Dialogs

| Variant | Usage | Visual |
|---------|-------|--------|
| **Confirm dialog** | Destructive actions, confirmations | `--surface-overlay` backdrop + centered panel |
| **Metadata dialog** | Capture picker metadata form | Inline form with Back/Save buttons |
| **Status panel** | Loading timeout/notice | Embedded panel with action buttons (retry/cancel) |

**Gap:** No dedicated reusable modal/dialog component exists. Each modal is implemented inline. See [Gap Analysis](#9-gap-analysis--roadmap).

### 3.7 Dropdowns & Menus

| Variant | CSS Class | Usage |
|---------|-----------|-------|
| **Settings select** | `.settings-select` | All settings dropdowns (language, mode, provider) |
| **Space select** | `.space-select-button` | Space/context selection buttons |

**Behavior:** Native `<select>` element with custom styling. No custom dropdown overlay — the OS-native dropdown menu appears. See [`desktop-dropdown-behavior.md`](desktop-dropdown-behavior.md).

### 3.8 Progress Indicators

| Variant | Surface | Visual |
|---------|---------|--------|
| **Ship trail progress bar** | Loading screen | Rail + gradient fill + ship icon with bloom/glow/core effects + trailing particles |
| **Percent display** | Loading screen | Large Orbitron text (0–100%) centered above progress |
| **Quantum ring spinner** | Installer | Two concentric rotating rings (cyan + gold, counter-rotating) with percent in center |
| **Progress bar** | Installer | Linear gradient fill (cyan) with right-edge glow |
| **Phase messages** | Loading + Installer | Rotating typewriter text messages (SC-themed) |
| **Module status list** | Loading screen | Per-module status indicators (ready/starting/preparing/delayed/blocked) |
| **Lore tips** | Loading screen | Rotating SC-themed tip text below progress |

### 3.9 Status Indicators

| Variant | Symbol | Color | Usage |
|---------|--------|-------|-------|
| Ready/OK | `●` | `--accent-success` | Module online, health good |
| Loading | `◐` | `--accent-primary` | In progress, starting |
| Empty | `◌` | `--text-secondary` | No data, awaiting |
| Warning | `⚠` | `--accent-warning` | Needs attention |
| Error | `●` | `--accent-danger` | Failed, offline |

**Component:** `WidgetStatePanelComponent` — reusable status display with title, state symbol, message, and optional retry button.

**States:** `loading`, `empty`, `partial`, `error`, `ready`

### 3.10 Scrollbars

**Source:** `modules/shared/design-system/lib/app-scrollbars.css`

| Property | Value |
|----------|-------|
| Track | Transparent or subtle dark |
| Thumb | `--border-default` (cyan rgba) |
| Thumb hover | `--border-strong` |
| Width | 6–8px |
| Radius | `var(--radius-sm)` |

12 CSS classes for various scrollbar contexts. See [`scrollbar-visibility-guidelines.md`](scrollbar-visibility-guidelines.md).

### 3.11 Icons & Iconography

| Category | Format | Location | Count |
|----------|--------|----------|-------|
| App icon | PNG (16–256px) + ICO + SVG | `modules/desktop/resources/icons/` | 7 sizes |
| Tray icons | SVG + PNG pairs | `modules/desktop/resources/tray/` | 10 states |
| Taskbar icon | SVG | `modules/desktop/resources/app-icon-taskbar.svg` | 1 |
| Logo (full) | SVG | `modules/loading/ui-angular/src/assets/logo-loading-full.svg` | 1 |
| Logo (minimal) | SVG | `modules/loading/ui-angular/src/assets/logo-loading-minimal.svg` | 1 |
| Provider icons | SVG | `modules/desktop/resources/icon-*.svg` | 3 (Anthropic, Google, OpenAI) |
| Community badge | PNG | `modules/desktop/resources/community-made-white.png` | 1 |
| Inline SVG icons | Embedded in templates | Various components | Category nodes, close, minimize, etc. |

**Tray icon states:**
- `default` — idle
- `default-glow` — idle with glow
- `active` — processing
- `idle` — low-power idle
- `error` — error/warning
- `notification` — notification pending
- `notification-glow` — notification with glow

### 3.12 Loading States

| Pattern | Visual | Duration |
|---------|--------|----------|
| **Typewriter text** | Characters appear one by one | Per-character delay |
| **Phase rotation** | Messages cycle through themed phases | 3–5s per message |
| **Anti-stall creep** | Progress bar advances slowly even without updates | Continuous |
| **Nebula entrance** | `scale(0.1) → scale(1)` with blur | 3s cubic-bezier |
| **Star field** | 50 procedural stars with random properties | Static (generated once) |
| **Particle spawner** | 4 particles tracking ship progress | Continuous while loading |

### 3.13 Notifications & Alerts

| Type | Visual | Usage |
|------|--------|-------|
| **Notice banner** | `--surface-panel-strong` bg, `--accent-warning` border-left | System notices in header area |
| **Timeout notice** | Status panel with retry button | Loading screen timeout |
| **Error state** | `--accent-danger` icon + message + retry | Loading / installer failure |
| **Asset download** | Progress with KB/s + ETA | Downloading additional assets |

**Gap:** No toast/snackbar notification system exists. See [Gap Analysis](#9-gap-analysis--roadmap).

---

## 4. Patterns & Layouts

### 4.1 Page Layouts

| Layout | Structure | Usage |
|--------|-----------|-------|
| **App shell** | Titlebar → Header → Content (full viewport) | Desktop main window |
| **Settings flow** | Cloud Compass → Category panel → Sub-panel | Settings navigation |
| **Loading screen** | Full-viewport centered (nebula bg + progress + messages) | App startup |
| **Installer flow** | 4-screen wizard (Welcome → Installing → Done/Error) | First-time setup |
| **Overlay** | Minimal floating card (voice bars + status) | In-game overlay |

### 4.2 Window Surface Pattern

**Class:** `.window-surface`

Every top-level window uses this wrapper:
- Background: `--surface-canvas`
- Border: `1px solid var(--border-subtle)`
- Radius: `var(--radius-md)`

### 4.3 Titlebar Pattern

| Element | Property |
|---------|----------|
| Height | 36px |
| Background | Transparent (inherits window surface) |
| Title | Orbitron, 14px, 0.12em letter-spacing |
| Drag region | `-webkit-app-region: drag` |
| Buttons | Right-aligned: minimize, maximize, close |
| Close hover | `--accent-danger` background |

Used in: Desktop app, Installer

### 4.4 Settings Pattern

**Current (production):** Setup wizard with carousel navigation (stepped, linear)
**Redesign (prototype — leading):** Cloud Compass with spatial navigation (hub-and-spoke, non-linear)

**Redesign key elements:**
- Nebula cloud center with scan pulse animation
- 4 category nodes with distinct colors
- Panel spawn/retract animations
- 12 sub-panels (3 per category)
- Finetune expander sections within panels
- Keyboard navigation (Escape = retract, arrows = spatial nav)

### 4.5 Widget State Pattern

**Source:** [`desktop-widget-state-pattern.md`](desktop-widget-state-pattern.md)

Every data-displaying widget follows these states:

| State | Display | User action |
|-------|---------|-------------|
| `loading` | Spinner + message | Wait |
| `empty` | Empty icon + "No data" message | None or configure |
| `partial` | Partial data + warning | May retry |
| `error` | Error icon + message + retry button | Retry |
| `ready` | Full content | Interact |

### 4.6 Setup Wizard Pattern (Installer)

**Screens:** Welcome → Installing → Done | Error

**Transitions:** `opacity 0→1, translateY 12px→0` at 0.5s ease

**Elements per screen:**
- **Welcome:** Logo animation, path input + browse, disk space info, Begin button
- **Installing:** Quantum ring visualization, phase messages, module name, progress bar
- **Done:** Green check with spring animation, "Launch" checkbox, Finish button
- **Error:** Red exclamation, error message, Try Again button

---

## 5. Motion & Animation

### 5.1 Timing Tokens

**Source:** `modules/shared/design-system/lib/logo-animations.css`

| Token | Value | Usage |
|-------|-------|-------|
| `--logo-speed` | `1` | Global speed multiplier |
| `--logo-t-breathe` | `4s` | Breathing/pulse cycles |
| `--logo-t-heartbeat` | `1.6s` | Heartbeat pulse |
| `--logo-t-awareness` | `8s` | Slow awareness shifts |
| `--logo-t-orbit` | `20s` (slow) / `8s` (fast) | Orbital motion |
| `--logo-t-data-stream` | `2s` | Data flow effects |

### 5.2 Interaction Timing

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button hover | 0.2s | ease |
| Button press | 0.12s | ease |
| Tooltip show/hide | 0.15s | ease |
| Panel spawn (Cloud Compass) | 0.3–0.5s | cubic-bezier |
| Screen transition (Installer) | 0.5s | ease |
| Page entrance (nebula zoom) | 3s | cubic-bezier(0.22, 1, 0.36, 1) |
| Node absorption | 0.4s | ease-in |
| Color morph | 0.6s | ease |

### 5.3 Animation Categories

| Category | Examples | Properties |
|----------|----------|------------|
| **Micro-interactions** | Button hover, toggle, focus ring | `transform`, `opacity`, `box-shadow` |
| **State transitions** | Panel open/close, screen change | `opacity`, `transform` (scale, translateY) |
| **Ambient loops** | Logo breathing, tray glow, star twinkle | `opacity`, `transform`, `filter` |
| **Loading feedback** | Progress bar, quantum rings, typewriter | `width`, `transform` (rotate), character reveal |
| **Entrance sequences** | Nebula zoom, logo appear, done spring | `transform` (scale), `filter` (blur), `opacity` |

**GPU rule:** Only use `transform`, `opacity`, and `filter` for animations. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`.

---

## 6. Accessibility

### 6.1 Focus Management

| Element | Focus indicator |
|---------|----------------|
| Buttons / controls | `2px solid` cyan outline, `2px` offset, contrast ring (`rgba(9,25,37,0.92)`) + outer glow |
| Toggle tracks | Same triple-ring system as buttons |
| Inputs | `--border-strong` + `--shadow-glow` |
| Spatial nav zones | Category-colored outline ring |

### 6.2 Keyboard Navigation

| Context | Keys | Behavior |
|---------|------|----------|
| Cloud Compass | Arrow keys | Spatial navigation between zones |
| Cloud Compass | Escape | Retract panel, return to cloud view |
| Carousel | ← → | Navigate settings pages |
| Tooltips | Tab / Escape | Show on focus / dismiss |
| Installer | Enter | Activate focused button |

### 6.3 ARIA Patterns

| Component | ARIA usage |
|-----------|-----------|
| Tooltips | `role="tooltip"`, `aria-describedby`, auto `tabindex` |
| Status panels | `aria-live="polite"`, `aria-atomic="true"` |
| Buttons | `aria-label` for icon-only buttons |
| Disabled controls | `aria-disabled="true"` alongside `:disabled` |
| Carousel | `aria-label` on prev/next buttons |

### 6.4 Known Gaps

- No skip-to-content link
- No high-contrast mode / reduced-motion support
- Screen reader testing not yet performed
- Color contrast ratios not formally audited (but likely passing given high-contrast palette)

---

## 7. Brand Assets

### 7.1 Logo

| Asset | File | Usage |
|-------|------|-------|
| Production logo | `assets/logo-v8-c.svg` | In-app branding |
| Full loading logo | `modules/loading/ui-angular/src/assets/logo-loading-full.svg` | Loading screen |
| Minimal loading logo | `modules/loading/ui-angular/src/assets/logo-loading-minimal.svg` | Compact contexts |
| Margin preview | `docs/ui/design-system/app-logo-margin-preview.svg` | Design reference (15% margin) |

**Design:** Quantum-nebula brain-core — abstract neural/quantum motif with cyan and gold palette.

### 7.2 App Icons

| Size | File | Usage |
|------|------|-------|
| 16px | `modules/desktop/resources/icons/app-icon-16.png` | Small UI, favicon |
| 32px | `modules/desktop/resources/icons/app-icon-32.png` | Taskbar (standard) |
| 48px | `modules/desktop/resources/icons/app-icon-48.png` | Alt+Tab |
| 128px | `modules/desktop/resources/icons/app-icon-128.png` | App grid |
| 256px | `modules/desktop/resources/icons/app-icon-256.png` | Store / high-DPI |
| ICO | `modules/desktop/resources/icons/app-icon.ico` | Windows executable |
| SVG (taskbar) | `modules/desktop/resources/app-icon-taskbar.svg` | Tray-adjacent |

### 7.3 Tray Icon States

10 SVG+PNG pairs in `modules/desktop/resources/tray/`:

| State | Description | Color accent |
|-------|-------------|-------------|
| `default` | Idle | Standard |
| `default-glow` | Idle with glow | Cyan glow |
| `active` | Processing | Bright |
| `idle` | Low-power | Dimmed |
| `error` | Error/warning | Red |
| `notification` | Notification | Gold |
| `notification-glow` | Notification + glow | Gold glow |

---

## 8. Cross-Surface Matrix

Consistency audit across all three UI surfaces.

### 8.1 Token Usage

| Token category | Desktop App | Loading Screen | Installer |
|----------------|:-----------:|:--------------:|:---------:|
| Surface colors | ✅ shared tokens | ✅ shared tokens | ⚠️ own copy |
| Text colors | ✅ shared tokens | ✅ shared tokens | ⚠️ own copy |
| Accent colors | ✅ shared tokens | ✅ shared tokens | ⚠️ own copy |
| Border colors | ✅ shared tokens | ✅ shared tokens | ⚠️ own copy |
| Radius | ✅ tokens (max 4px) | ✅ consistent | ✅ consistent |
| Shadows | ✅ tokens | ✅ consistent | ⚠️ simplified |
| Fonts | ✅ Inter + Orbitron + Caveat | ✅ Inter + Orbitron | ⚠️ Inter + Orbitron (no Caveat) |
| Cursors | ✅ full 15+ states | ✅ inherited | ⚠️ 4 states only |

**Legend:** ✅ = uses shared tokens, ⚠️ = defines own copies (may drift)

### 8.2 Component Availability

| Component | Desktop App | Loading Screen | Installer |
|-----------|:-----------:|:--------------:|:---------:|
| Primary button | ✅ `.ui-control-primary` | ❌ no buttons | ✅ own class |
| Secondary button | ✅ `.ui-control-secondary` | ❌ | ✅ own class |
| Text input | ✅ settings forms | ❌ | ✅ path input |
| Select/Dropdown | ✅ `.settings-select` | ❌ | ❌ |
| Checkbox | ✅ language filters | ❌ | ✅ launch checkbox |
| Toggle | ✅ AI settings | ❌ | ❌ |
| Tooltip | ✅ directive | ❌ | ❌ |
| Progress bar | ❌ | ✅ ship trail | ✅ gradient bar |
| Status indicators | ✅ widget state panel | ✅ module status | ✅ done/error icons |
| Scrollbar | ✅ custom | ❌ (no scroll) | ❌ (no scroll) |
| Titlebar | ✅ custom | ❌ (frameless) | ✅ custom |
| Scanlines | ✅ Cloud Compass | ✅ atmosphere | ✅ body::before |

### 8.3 Drift Risk Assessment

| Surface | Risk | Issue |
|---------|------|-------|
| **Loading Screen** | 🟢 Low | Imports shared tokens directly; minimal own components |
| **Installer** | 🔴 High | Standalone `styles.css` with **hardcoded copies** of all tokens. Any token update must be manually mirrored. Missing Caveat font, only 4 cursor states, own button classes. |

---

## 9. Gap Analysis & Roadmap

### 9.1 Missing Components

Components that are needed but don't exist as reusable, documented elements:

| Component | Priority | Current state | Needed for |
|-----------|----------|---------------|-----------|
| **Toast / Snackbar** | High | Not implemented | Non-blocking notifications, success feedback |
| **Reusable Modal** | High | Each modal is bespoke inline HTML | Confirmations, dialogs, info popups |
| **Table / Data Grid** | Medium | No formal table styles | Future data views (inventory, loadouts, org) |
| **Tabs** | Medium | No tab component (carousel used instead) | Multi-section content |
| **Breadcrumbs** | Low | Not needed yet | Deep navigation (if app grows) |
| **Badge / Tag** | Medium | Inline styling only | Status labels, version tags, filters |
| **Skeleton loader** | Medium | Not implemented | Content loading placeholders |
| **Slider / Range** | Low | Not implemented | Volume, sensitivity settings |
| **Search input** | Low | Not implemented | Future content search |
| **Accordion** | Medium | Finetune expanders exist but not reusable | Collapsible sections |
| **Context menu** | Low | Not implemented | Right-click actions |

### 9.2 Inconsistencies to Resolve

| Issue | Location | Resolution |
|-------|----------|------------|
| Installer uses hardcoded token copies | `installer/ui/styles.css` | Refactor to import shared tokens (or generate from source) |
| Installer has only 4 cursor states | `installer/ui/styles.css` | Import full cursor-tokens.css |
| Installer button classes differ from app | `installer/ui/styles.css` | Align with `.ui-control-*` classes |
| No Caveat font in installer | `installer/ui/styles.css` | Add if attribution text needed |
| Tooltip styles not in shared CSS | Desktop-only directive | Extract `.scc-tooltip` class to shared |
| Modal styles not documented | Various inline | Create `.scc-modal` pattern |
| Form validation states missing | No error/warning input styling | Define input error/success states |
| Status indicator not in shared CSS | `WidgetStatePanelComponent` only | Extract `.scc-status-*` classes |

### 9.3 Design System Maturity Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1: Document** | This document — catalog what exists | ✅ Complete |
| **Phase 2: Review** | Audit all UI elements against this system | 🔜 Next |
| **Phase 3: Align** | Fix inconsistencies (installer, missing shared classes) | Planned |
| **Phase 4: Extract** | Create shared CSS classes for all components | Planned |
| **Phase 5: Preview** | Interactive HTML preview page showing all components | Planned |

---

## Appendix A: File Map

### Shared (cross-surface)

| File | Purpose |
|------|---------|
| `modules/shared/design-system/lib/design-tokens.css` | Global tokens: surfaces, text, accents, borders, radius, shadows, fonts |
| `modules/shared/design-system/lib/cursor-tokens.css` | 15+ custom Sentinel cursor states (SVG data URIs) |
| `modules/shared/design-system/lib/control-states.css` | Button/select/toggle hover/active/disabled/focus states |
| `modules/shared/design-system/lib/app-scrollbars.css` | Custom scrollbar system (12 classes) |
| `modules/shared/design-system/lib/logo-animations.css` | Logo animation keyframes (45+) |
| `modules/shared/design-system/lib/window-surface.css` | `.window-surface` wrapper |

### Desktop

| File | Purpose |
|------|---------|
| `modules/desktop/shared/styles/desktop-shell-base.css` | Shell foundation: titlebar, header, notice |
| `modules/desktop/shared/styles/desktop-theme.css` | Theme tokens: spacing, status colors, component overrides |
| `modules/desktop/ui-angular/src/styles.css` | Root stylesheet (imports all shared + desktop tokens) |
| `modules/desktop/ui-angular/src/app/spatial-nav.css` | Spatial navigation styling (6 zone colors) |
| `modules/desktop/ui-angular/src/app/settings-cloud-compass.component.scss` | Cloud Compass: nebula, atmosphere, scanlines, panels |

### Loading Screen

| File | Purpose |
|------|---------|
| `modules/loading/ui-angular/src/styles.css` | Imports shared tokens |
| `modules/loading/ui-angular/src/app/app.component.css` | Nebula entrance, atmosphere, stars |
| `modules/loading/ui-angular/src/assets/loading-progress.css` | Ship trail progress bar |

### Installer

| File | Purpose |
|------|---------|
| `installer/ui/styles.css` | **Standalone** — own token copies, buttons, inputs, cursors, animations |
| `installer/ui/index.html` | 4-screen wizard layout |
| `installer/ui/installer.js` | Screen transitions, progress updates, particle canvas |

### Documentation

| File | Purpose |
|------|---------|
| `docs/ui/STYLEGUIDE.md` | Visual style guide (source of truth for token values) |
| `docs/ui/DESIGN-SYSTEM.md` | **This document** — component catalog & system overview |
| `docs/ui/design-token-layer.md` | 4-layer token architecture |
| `docs/ui/cursor-guidelines.md` | Cursor policy & lint rules |
| `docs/ui/radius-guidelines.md` | Radius scale & RSI sharp-edges principle |
| `docs/ui/scrollbar-visibility-guidelines.md` | Scrollbar behavior rules |
| `docs/ui/settings-cloud-compass.md` | Cloud Compass navigation specification |
| `docs/ui/desktop-dropdown-behavior.md` | Dropdown position logic |
| `docs/ui/desktop-widget-state-pattern.md` | Widget state machine (loading/empty/error/ready) |
| `docs/ui/state-copy-guidelines.md` | Copy/text guidelines for states |
| `docs/ui/verse-news-scatter-layout.md` | News layout algorithm |

### Prototypes & Concepts

| File | Purpose |
|------|---------|
| `docs/ui/concepts/mockup-desktop-redesign.html` | Desktop redesign mockup |
| `docs/ui/concepts/mockup-settings-nav-v3.html` | Cloud Compass prototype |
| `docs/ui/concepts/mockup-setup-wizard.html` | Setup wizard flow |
| `docs/ui/concepts/mockup-setup-wizard-warp.html` | Setup wizard warp effect |
| `docs/ui/concepts/mockup-nav-concepts.html` | Navigation explorations |
| `docs/ui/concepts/mockup-debug-zones.html` | Layout debug visualization |
| `concepts/loading-screen-exploration.html` | Loading screen variants |

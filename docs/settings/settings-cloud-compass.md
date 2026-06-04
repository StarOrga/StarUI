# Settings UI — Cloud Compass Navigation

## Architecture

The settings view uses the **Cloud Compass** navigation pattern: a central animated nebula cloud with orbiting category nodes. Clicking a category spawns floating panels around the cloud with the category's settings.

### Component: `SettingsCloudCompassComponent`
- Selector: `settings-cloud-compass`
- Location: `modules/desktop/ui-angular/src/app/settings-cloud-compass.component.ts`
- Standalone Angular component, lives inside `<section class="settings-panel">` in `app.html`

### DOM Position
The settings-panel section **must** be outside `<div class="shell-body" [hidden]="true">`. It is a sibling of shell-body, direct child of the `.app` root div. This is critical — shell-body's `[hidden]` prevents child rendering.

## Layout Rules

### Minimum Viewport
- Minimum supported window size: **1100 × 720px**
- All panels must fit without scrolling at this size
- Panels use `overflow: hidden` (no scrollbars)

### Dead Zones — No Panel Overlap
These areas must never be covered by settings panels:

| Zone | Position | Size | Purpose |
|------|----------|------|---------|
| Nebula cloud | center (50%, 48%) | 320 × 280px | Central navigation element |
| Cloud buffer | 30px around cloud | — | Visual breathing room |
| Header bar | top 0–40px | full width | Window controls (gear, minimize, fullscreen, close) |
| Category nodes | 4 positions (see below) | ~50px each | Navigation targets |

### Category Node Positions
Nodes are pushed to the edges to maximize panel space:

| Node | Position | Rationale |
|------|----------|-----------|
| Game | `left: 50%, top: 8%` | Top center, above cloud |
| AI | `left: 5%, top: 50%` | Far left, clear of left panels |
| App | `left: 50%, top: 92%` | Bottom center, below panels |
| Overlay | `left: 95%, top: 50%` | Far right, clear of right panels |

### Panel Positions (3-panel layout)
All categories use a 3-panel layout: left, bottom, right.

| Panel | CSS Position | Width | Max Height |
|-------|-------------|-------|------------|
| Left | `left: 60px; top: 15%` | `min(280px, calc(50% - 220px))` | 70% |
| Bottom | `left: 50%; top: calc(48% + 170px); transform: translateX(-50%)` | `min(420px, 85vw)` | `calc(92% - 48% - 170px - 20px)` |
| Right | `right: 60px; top: 15%` | `min(280px, calc(50% - 220px))` | 70% |

### Panel Class Names
Inner panels use class `.compass-panel` (NOT `.settings-panel` — that name is used by the outer section and would conflict with global CSS rules).

## Animations

### Entrance Sequence (opening settings)
1. **Content fade** (0.4s): Spatial-world content (tiles, clouds, views) scales up 1.5× and fades out. Side corners (TL, BL, BR) hide via `.sn-corner--hidden`.
2. **Nebula zoom** (3s): Cloud fades in small (`scale(0.1)`) and zooms to full size. Uses `cubic-bezier(0.25, 0.1, 0.25, 1)` for smooth continuous motion — no plateau at the end.
3. **Node entry** (staggered 0.2s per node): After zoom completes, category nodes appear with scale+blur entry animation.

### Exit (closing settings)
- `resetState()` clears: `currentCategory`, `cloudLabelText`, all panel visibility, all node states
- Content fades back in (reverse of entrance)

### Category Selection
- Clicked node absorbs into cloud center (0.7s fly animation)
- Cloud color shifts to category color (1.2s CSS transition on blob backgroundColor)
- Other nodes dim to 0.15 opacity
- Category panels spawn from cloud center (1s blur+scale animation)

### Category Switching
- Old panels retract to cloud center
- Old node flies back from center to its position (dimmed)
- New node absorbs into cloud
- Cloud color shifts
- New panels spawn

### Back to Overview
- Click cloud or press Escape
- Panels retract, cloud label hides
- Cloud resets to cyan
- All nodes re-enter with scan pulse

## Settings Content per Category

### App (3 panels)
- **General** (left): Language, Monitor, Finetune: Theme
- **Audio** (bottom): Microphone + meter + test, Speaker + meter + test
- **Startup** (right): Start with Windows, Start minimized

### Game (3 panels)
- **Version** (left): Channel (LIVE/PTU/EPTU), Auto-detect, Game version display
- **Paths** (bottom): SC install dir, RSI Launcher path, Keybinding profile path (all with Browse)
- **Fixes** (right): Clear shaders, Character Reset, Reset USER folder

### AI (3 panels)
- **Language & Voice** (left): AI enabled, Voice activation, Language, Activation mode
- **Playground** (bottom): Text input + Send, Response display
- **Configuration** (right): Mode (Performance/Balanced/Quality), Provider, Finetune: API keys

### Overlay (3 panels)
- **OCR** (left): Enable OCR, OCR Languages grid
- **Display** (bottom): Position, Opacity, Finetune: Refresh rate
- **Hotkeys** (right): Toggle overlay hotkey, Screenshot hotkey

## Color Scheme

| Element | Category | RGB | Hex | Token | Usage |
|---------|----------|-----|-----|-------|-------|
| Cloud tint | Default | 82, 193, 230 | #52c1e6 | `--accent-primary` | Nebula default |
| Cloud tint | Game | 200, 168, 75 | #c8a84b | `--sn-gold` | Nebula tint |
| Cloud tint | AI | 140, 100, 200 | #8c64c8 | `--sn-purple` | Nebula tint |
| Cloud tint | Overlay | 240, 194, 123 | #f0c27b | `--sn-warm` | Nebula tint |
| Node + panel header | Game | 192, 120, 136 | #c07888 | `--cat-game` | Dusty Rose |
| Node + panel header | AI | 155, 140, 200 | #9b8cc8 | `--cat-ai` | Lavender |
| Node + panel header | App | 74, 158, 150 | #4a9e96 | `--cat-app` | Deep Teal |
| Node + panel header | Overlay | 196, 133, 108 | #c4856c | `--cat-overlay` | Copper |

## Category Node Icons

Each category node uses a bare SVG icon — no circle container, no glow effect.

| Property | Value | Notes |
|----------|-------|-------|
| Size | `34 × 34px` | SVG width/height inside `.icon-circle` |
| Style | `stroke: currentColor` | Inherits category color (`--cat-*`) |
| Stroke width | `1.5px` | Consistent with app icon language |
| Container | Flex-only `.icon-circle` | No `border-radius`, no `border`, no `box-shadow` |
| Hover / dimmed | No glow | Interaction is conveyed via opacity only (dimmed: 0.15 → 0.55 on hover) |

> **Rule:** Never add `border-radius`, `border`, or `box-shadow` (glow) back to `.icon-circle`. The icons stand on their own — the category color and size provide sufficient affordance.

## CSS Dependencies

- **spatial-nav.css**: Settings-panel positioning (`position: fixed`), content fade transitions, corner hiding
- **styles.css**: Settings-panel base opacity/transform transitions
- **settings-cloud-compass.component.scss**: All Cloud Compass internal styles (encapsulated)
- Fonts: `Inter` (body text), `Orbitron` (headers, labels) — loaded via Google Fonts in `index.html` CSP

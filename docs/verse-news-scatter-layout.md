# Verse News — Scatter Layout Algorithm

## Overview

The Verse News page arranges content tiles (videos, blog posts, patch info) in a **concentric ring layout** around a central refresh button. The layout creates an organic, space-themed aesthetic where tiles appear scattered yet structured — suggesting orbiting objects in the verse.

**Interactive reference:** [`mockup-debug-zones.html`](../../mockup-debug-zones.html) — open in a browser and resize to see zones, rings, and slot validation in real-time. Click to re-randomize.

## Layout Principles

1. **Concentric rings** — Tiles are placed on invisible guide circles (rings) radiating outward from the center
2. **Live/PTU first** — Version info tiles are pinned to the top center as Ring 1 members
3. **One tile per Y-band per side per ring** — No two tiles on the same ring and same side (left/right of center) share a similar vertical position
4. **Organic jitter** — Each tile gets up to 30% random offset from its ideal ring position
5. **New positions on refresh** — Every refresh randomizes the starting angle, producing a new layout

## Responsive Values

All layout parameters are computed from the viewport, not fixed pixel values. This ensures correct scaling from FHD (1920x1080) to 4K (3840x2160) and beyond.

| Parameter | Formula | FHD ~value | 4K ~value |
|-----------|---------|------------|-----------|
| Tile width | `vMin * 0.21` | 178px | 227px |
| Tile height | `tileW * 9/16 * 1.35` | 143px | 191px |
| Edge padding | `vMax * 0.055` | 106px | 211px |
| Top padding | `vMin * 0.09` | 78px | 97px |
| Tile gap | `vMin * 0.05` | 43px | 54px |
| Center exclusion | `vMin * 0.035 * 2` | 60px | 76px |
| Ring step | `tileDiagonal + tileGap` | ~272px | ~342px |

Where `vMin = min(viewportW, viewportH)` and `vMax = max(viewportW, viewportH)`.

## Ring Generation

```
Ring spacing = sqrt(tileW^2 + tileH^2) + tileGap
```

This ensures any tile placed at any point on a ring circle cannot overlap tiles on adjacent rings.

### Ring Filtering

A ring is **skipped** if less than 66% of its **visible** slots (those within the app window) fall inside the usable area (inside edge padding). Slots completely outside the window are excluded from the calculation.

```
visibleSlots = slots where tile overlaps app window
usableSlots = visible slots inside edge padding + media zone
ratio = usableSlots / visibleSlots
if ratio < 0.66 → skip ring entirely
```

## Tile Count Target

Per active ring: `floor(maxSlotsOnRing * 0.70)`

Sum across all active rings, minus 2 (Live/PTU are pre-placed).

## Placement Rules

### Collision Prevention
- **No overlap**: `|dx| >= tileW + gap AND |dy| >= tileH + gap`
- **40% stagger**: No two tiles (except Live+PTU pair) within 40% of tile size on both axes simultaneously
- **Center exclusion**: No tile may overlap the refresh button zone (`CENTER_R * 2` radius)

### Y-Band Rule (per ring, per side)
Each ring tracks placed Y-centers split by side (left/right of viewport center). A new tile is rejected if another tile on the **same ring and same side** has a Y-center within `tileH * 0.6`.

Tiles on **opposite sides** of the same ring may share a Y-band — they're visually distinct on the circle arc.

### Version Tile Priority
Live and PTU tiles are placed first at fixed positions (top center, left/right of center). They count as Ring 1 members and block their Y-band on their respective sides.

## Animations

### Refresh Cycle
1. **Suck-in** (400ms): All tiles translate toward center + scale to 0.1 + fade out
2. **Star suck** (parallel): Background stars drift toward center
3. **Spawn** (staggered 70ms per tile): Tiles appear from center, ease outward with deceleration curve
4. **Star scatter** (parallel): Stars drift to new random positions

### Background Stars
- 30 fixed stars, always visible at base alpha
- Only ~2 stars animate at any time (slow 8-15s cycles per star)
- Subtle bloom at peak brightness
- Stars participate in refresh animation (suck + scatter)

### Unsubscribe Overlay
- Community tiles show a full-tile overlay after **3 seconds** of continuous hover
- Shows creator name + unsubscribe button
- Fades out immediately on mouse leave

## Content Area Layout

```
+--[TITLEBAR]------------------------------------------+
|                                                       |
|                  VERSE NEWS                           |
|            [LIVE 4.0.1]  [PTU 4.0.2]                |
|                                                       |
|     [tile]          [tile]           [tile]           |
|                                                       |
|           [tile]    [refresh]    [tile]               |
|                                                       |
|     [tile]          [tile]           [tile]           |
|                                                       |
|  NAV                                          NAV    |
+--[FOOTER: icon | JOIN THE UNIVERSE | RAM CPU]--------+
```

Navigation waypoints are positioned at screen edges (left, right, bottom-left, bottom-right) and appear on hover.

## File References

| File | Purpose |
|------|---------|
| `mockup-desktop-redesign.html` | Full interactive mockup with all features |
| `mockup-debug-zones.html` | Layout algorithm debug visualization |
| `docs/ui/verse-news-scatter-layout.md` | This document |

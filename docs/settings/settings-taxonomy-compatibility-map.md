# Settings UX Taxonomy Compatibility Map

This map applies a **user-goals-first taxonomy** to Settings labels while preserving the existing section/card IDs and `data-target` anchors to avoid cross-module breakage.

## Compatibility Guarantees

- Section anchors in `modules/desktop/src/index.html` remain unchanged: `settings-app`, `settings-game`, `settings-ai`, `settings-overlay`.
- Existing card IDs remain unchanged: `settings-game-version-card`, `settings-game-paths-card`.
- Renderer card routing remains ID-based (`openSettingsToCard(sectionId, cardId)` resolves cards via `document.getElementById(cardId)`).

## Label Mapping (Old → New)

### Sections (IDs unchanged)

| Section ID (`data-target`) | Old label | New label |
|---|---|---|
| `settings-app` | App | Setup & Devices |
| `settings-game` | Game | Star Citizen Connection |
| `settings-ai` | AI | AI Copilot |
| `settings-overlay` | Overlay | Overlay & OCR |

### Cards (IDs unchanged)

| Card ID | Old label | New label |
|---|---|---|
| *(no explicit card id)* | App General | Setup & Devices |
| `settings-game-version-card` | Game Version | Star Citizen Connection Status |
| `settings-game-paths-card` | Game Paths | Launcher & Game Paths |
| *(no explicit card id)* | Game Version (`scProfileInfoTitle`) | Profile & Language Detection |
| *(no explicit card id)* | Game Fixes | Recovery Tools |
| *(no explicit card id)* | AI General | AI Copilot Essentials |
| *(no explicit card id)* | AI Configuration | Model & Provider Routing |
| *(no explicit card id)* | AI Test | AI Copilot Test Console |
| *(no explicit card id)* | Overlay OCR | Overlay & OCR Controls |

## Implementation Notes

- Changes are currently label/microcopy-only (no anchor or routing refactor).
- Translation keys are retained; only values were updated for compatibility-safe rollout.

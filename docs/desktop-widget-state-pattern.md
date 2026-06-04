# Desktop UI Guideline (Binding): Reusable Widget State Pattern

## Status

Binding guideline for Desktop Angular UI surfaces.

## Goal

Standardize loading/empty/error handling across widgets with one reusable state pattern
for consistent behavior, copy, and visual semantics.

## State model

Every widget must expose a local state object:

- `mode`: `loading | empty | partial | error | ready`
- `message`: concise current-state text
- `retryLabel`: clear action copy for local recovery

`ready` is the normal state, while `loading`, `empty`, `partial`, and `error` are fallback states.

## Reusable UI contract

Use the shared `widget-state-panel` component in Desktop Angular templates.

Inputs:

- `title`: widget title
- `state`: state object (`mode`, `message`, `retryLabel`)
- `showRetryButton`: whether retry action is displayed
- `retryLabel`: action label

Output:

- `retry`: emitted on local retry action

Behavior requirements:

1. Always render state message.
2. Render retry only when useful (typically non-`ready`).
3. Use assertive live region only for `error`; otherwise polite updates.
4. Keep recovery local first (widget retry path) before global escalation.

## Visual semantics

The state panel uses consistent border and indicator coloring:

- `loading`: info tint
- `empty`: neutral tint
- `partial`: warning tint
- `error`: critical tint
- `ready`: success tint

The icon glyph is state-derived and must be applied centrally in the shared component.

## Migration order completed

First wave (requested priority):

1. Newsticker (`news`)
2. Videos (`videos`)
3. Keybindings (`keybindings`)

Second wave (incremental rollout):

4. Daily Ops (`daily-ops`)
5. Ship Intel (`ship-intel`)

## UX consistency review (short)

Review result: pass with minor copy harmonization already applied by reusing `retryLabel`.

Checked:

- Uniform state title + mode rendering across widgets.
- Uniform retry CTA placement and ghost style.
- Uniform indicator semantics for quick scanning.
- Screen-reader update behavior aligned (`error` assertive, others polite).

Follow-up recommendation:

- Gradually externalize all state strings into i18n resources to remove mixed-language copy risk.

## Integration rule

New Desktop widgets must not implement ad-hoc state banners. They must use the shared
`widget-state-panel` and `widgetStates` model.

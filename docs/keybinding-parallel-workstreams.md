# Keybinding UI Classification Model

This document defines how keybindings should be classified and presented in the UI.

## Purpose

Provide a shared classification model for keybindings so users can quickly find, assign, and validate controls based on gameplay context.

## Core Classification Dimensions

### 1) Gameplay Context

Defines where an action is relevant.

- `infantry`
- `ground_vehicle`
- `spaceship`
- `hybrid` (valid in more than one context)

UI expectation:
- Context must be visible on every binding row.
- Context filter must be first-class in the filter panel.

### 2) Role Affinity

Defines who typically needs the action.

- `pilot`
- `mining_technician`
- `salvage_technician`
- `technician_general`
- `multi_role`

UI expectation:
- Users can switch between role-focused and all-role views.
- Recommended bindings should prioritize the selected role.

### 3) Urgency Tier

Defines expected reaction time and recommended input channel.

- `tier_a_reflex` (milliseconds-critical)
- `tier_b_fast` (quick, but not reflex-critical)
- `tier_c_deliberate` (non-urgent or low-frequency)

UI expectation:
- Every binding has an urgency badge.
- Tier filter exists and is persistent for current session.

### 4) Device Coverage

Defines which hardware can trigger the action.

- `keyboard_mouse`
- `gamepad`
- `joystick`
- `hotas`
- `pedals`
- `voice`
- `multi_device`

UI expectation:
- Binding details show mapping per supported device.
- Unsupported device combinations are explicitly shown as gaps.

### 5) Interaction Semantics

Defines how the action behaves when invoked.

- `direct_select`
- `cycle`
- `relative_adjust`
- `absolute_set`
- `toggle`
- `hold`

UI expectation:
- Semantics are shown next to the binding name or in detail view.
- Users can filter by semantics when creating role presets.

### 6) Interference Risk

Defines whether assignments can collide in active gameplay states.

- `critical_conflict`
- `conditional_conflict`
- `safe`

UI expectation:
- Conflict state is visible in list and detail view.
- Conflict-only mode is available for cleanup workflows.

## Keybinding Record Shape (Conceptual)

Each binding should be representable with the following conceptual fields:

- `id`
- `action_name`
- `aliases[]`
- `contexts[]`
- `roles[]`
- `urgency_tier`
- `supported_devices[]`
- `device_mappings{}`
- `interaction_mode`
- `voice_fallback` (optional)
- `conflict_state`
- `conflict_with[]` (optional)

## UI Information Architecture

The keybinding UI should combine discovery and editing in one flow:

1. **Context Header**
   - active context, role, and device profile
2. **Filter + Search Panel**
   - dimensions: context, role, urgency, device, semantics, conflict state
   - fuzzy search over action name and aliases
3. **Binding List**
   - grouped by functional category (movement, combat, systems, utility)
   - badges for urgency and conflict
4. **Binding Detail Panel**
   - device-specific mappings
   - semantics and voice fallback
   - conflict explanation

## Recommended Visibility Rules

- `tier_a_reflex` bindings should always be visually prioritized in list sorting.
- When context + role are selected, non-matching bindings should be hidden by default.
- Critical conflicts should use blocking visual treatment and save-time warnings.
- Voice-first mappings should still support explicit fallback visibility.

## Search and Filter Behavior

- Fuzzy search matches `action_name`, `aliases`, and category labels.
- Filters are combinational (`AND` across dimensions, `OR` inside each dimension value set).
- Conflict filter should support:
  - all
  - critical only
  - critical + conditional

## Preset Perspective (User-Centric)

Presets should represent user intent, not raw key maps only.

A preset should capture:
- selected role
- selected contexts
- active devices
- prioritized urgency behavior (e.g., strict tier-a accessibility)
- chosen interaction style preferences (e.g., prefer direct over cycle)

## Validation Expectations

A valid setup should satisfy:

- no `critical_conflict` inside currently active context + role + device set
- all `tier_a_reflex` actions mapped to reachable non-voice primary inputs
- at least one fallback path for high-impact actions where supported

## Notes

This document intentionally describes classification and UI modeling only.
It does not prescribe team workflow, branching strategy, or merge process.

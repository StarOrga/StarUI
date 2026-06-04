# Desktop Widget State & Notice Policy

## Scope

Desktop Angular content widgets share a consistent local state model:

- `loading`
- `empty`
- `partial`
- `error`
- `ready` (normal display state)

The four required fallback states (`loading`, `empty`, `partial`, `error`) are mandatory per widget.

## Widgets covered

- Verse News (`news`)
- Video highlights (`videos`)
- Keybindings (`keybindings`)
- Content tiles (`daily-ops`, `ship-intel`)

Each widget renders:

- a local state badge/message
- a local retry action (`Erneut laden`)

## Retry routing

Local retry is routed through desktop IPC without escalating to global UI errors:

- `news` / `videos` -> `news:request`
- `keybindings` -> `game:local-info:update`
- static content tiles -> `windows:request` (best-effort refresh trigger)

## Global status-hover policy

Content-only fetch failures must **not** appear as global system-hints when a widget already presents the failure locally.

Keep global status-hover notices only for cross-cutting/runtime-critical classes:

1. Module offline / disconnected runtime
2. Authentication / authorization failures
3. Sync-layer degradation (sequence/SLA reconciliation)

This keeps global notices actionable while preserving detailed troubleshooting at widget scope.


## Status-area vs widget-area responsibility split

To keep system feedback actionable and non-noisy:

- **Status area / status-hover (`Systemhinweise`)** must only represent **system state** (runtime/module health, auth, sync propagation quality).
- **Widget surfaces** must represent **content and source retrieval issues** local to that widget.
- Content fetch failures stay in widget state blocks with local retry and do not automatically escalate to global runtime notices.

## Status-hover timeline snapshot

The status-hover panel should include a compact, current snapshot list:

1. Module status (healthy vs degraded/offline)
2. Last successful runtime update (event-received timestamp)
3. Active disturbances count (current unresolved notices)

This list is informational and supplements prioritized notices.

## State transition signaling and escalation

- State changes in the status area should be marked subtly using a small **orange transition indicator**.
- Avoid intrusive banners/toasts for normal transition traffic.
- Use prominent styling only for **blocking states** (for example module offline or authentication failures).
- Non-blocking degradations (for example sync warnings) remain visible in status-hover without elevated banner treatment.

## Sync validation requirement (event-driven)

Runtime state propagation to desktop status UI must be event-driven (`core-status` / `core-message`) with SLA monitoring.

- Polling-only status transport is not acceptable.
- If no propagation action arrives within 500ms after a relevant event window, treat as sync violation and trigger reconciliation.


# Desktop settings subnav status semantics

The desktop settings subnav items (`.settings-subnav-item`) render a compact status indicator that reflects the current state of each target settings card.

## Status states

- `ok`
  - Meaning: the card currently contains at least one explicit success signal and no higher-priority warning/error signal.
  - Visual class: `.settings-subnav-item--ok`
  - Token: `--settings-subnav-status-ok`
- `warning`
  - Meaning: the card currently contains a non-fatal caution signal that should be reviewed.
  - Visual class: `.settings-subnav-item--warning`
  - Token: `--settings-subnav-status-warning`
- `action-needed`
  - Meaning: the card currently contains an invalid/error signal that requires a user fix.
  - Visual class: `.settings-subnav-item--action-needed`
  - Token: `--settings-subnav-status-action-needed`

If no matching signal exists, the indicator stays in an idle neutral style (`--settings-subnav-status-idle`).

## Source signals and precedence

Status derivation is based on existing card-local validity/status markers in `renderer.js` and follows this priority:

1. **action-needed** (highest)
   - Any of:
     - `.verify-status.bad`
     - `.path-verify-status.bad`
     - `[aria-invalid="true"]`
     - `.is-danger`
2. **warning**
   - Any of:
     - `.status-warn`
     - `.is-warn`
     - `.verify-status.warn`
     - `.verify-status.status-warn`
3. **ok**
   - Any of:
     - `.verify-status.ok`
     - `.path-verify-status.ok`
     - `.status-ok`
     - `.is-ok`

This allows subnav indicators to reuse already-emitted runtime signals (path checks, verify statuses, health badges) without changing click/scroll navigation wiring.

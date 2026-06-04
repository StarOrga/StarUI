# UI State Copy Guidelines (Star Citizen Companion)

## Purpose
This guideline defines how we write short state messages across **loading**, **desktop**, and **overlay** widgets.

## Tone and style
- Keep the voice **charming and slightly cheeky**, never snarky.
- Keep messages short and operational: one context line, one clear action.
- For critical failures, remove jokes and stay calm, direct, and respectful.
- Prefer plain verbs over vague wording (`Check source`, `Reload`, `Try again later`).
- Avoid blame language (`you did...`), focus on next step.

## Mandatory CTA set
Use one primary action label per state, always explicit:
- **Check source**
- **Reload**
- **Try again later**

If a secondary action exists, keep it clearly lower priority.

---

## State text blocks by widget

### 1) Empty
#### Loading widget
- Variant A: `Hangar is clear. No fresh feed yet.` → **Reload**
- Variant B: `No flight data in queue right now.` → **Reload**
- Variant C: `Quiet sector. Nothing to show yet.` → **Reload**
- First-user fallback: `No data available yet.` → **Reload**

#### Desktop widget
- Variant A: `Spectrum is quiet — no updates landed yet.` → **Reload**
- Variant B: `No entries on this panel yet.` → **Reload**
- Variant C: `This board is empty for now.` → **Reload**
- First-user fallback: `This section has no items yet.` → **Reload**

#### Overlay widget
- Variant A: `Overlay scan found no usable content.` → **Reload**
- Variant B: `No capture data in this view yet.` → **Reload**
- Variant C: `Nothing readable in the current frame.` → **Reload**
- First-user fallback: `No content detected.` → **Reload**

### 2) Timeout
#### Loading widget
- Variant A: `FTL handshake timed out before sync completed.` → **Reload**
- Variant B: `Connection took too long to respond.` → **Reload**
- Variant C: `Startup link exceeded its response window.` → **Reload**
- First-user fallback: `Loading took too long.` → **Reload**

#### Desktop widget
- Variant A: `Data uplink timed out. Last signal was incomplete.` → **Check source**
- Variant B: `This panel waited too long for fresh input.` → **Check source**
- Variant C: `Response timeout reached before update arrived.` → **Check source**
- First-user fallback: `The source did not answer in time.` → **Check source**

#### Overlay widget
- Variant A: `Overlay feed timed out during capture.` → **Reload**
- Variant B: `Frame analysis took too long to finish.` → **Reload**
- Variant C: `Capture response window expired.` → **Reload**
- First-user fallback: `The overlay request timed out.` → **Reload**

### 3) Source unavailable
#### Loading widget
- Variant A: `Nav beacon not reachable right now.` → **Check source**
- Variant B: `Source channel is currently unavailable.` → **Check source**
- Variant C: `Could not contact upstream source.` → **Check source**
- First-user fallback: `The data source is currently unavailable.` → **Check source**

#### Desktop widget
- Variant A: `Comm source is out of range at the moment.` → **Check source**
- Variant B: `This panel has no active source connection.` → **Check source**
- Variant C: `Source endpoint is unavailable right now.` → **Check source**
- First-user fallback: `Cannot reach the source right now.` → **Check source**

#### Overlay widget
- Variant A: `Overlay source stream is unavailable.` → **Check source**
- Variant B: `Capture source cannot be reached.` → **Check source**
- Variant C: `Source input is missing for this overlay.` → **Check source**
- First-user fallback: `The input source is unavailable.` → **Check source**

### 4) Offline module
#### Loading widget
- Variant A: `Module is offline. Docking retry required.` → **Try again later**
- Variant B: `Startup module went offline during sync.` → **Try again later**
- Variant C: `Required module is currently offline.` → **Try again later**
- First-user fallback: `A required module is offline.` → **Try again later**

#### Desktop widget
- Variant A: `Desktop module is offline. Live panel paused.` → **Try again later**
- Variant B: `This widget is offline until module reconnects.` → **Try again later**
- Variant C: `Module connection dropped for this panel.` → **Try again later**
- First-user fallback: `This module is currently offline.` → **Try again later**

#### Overlay widget
- Variant A: `Overlay module is offline. HUD sync paused.` → **Try again later**
- Variant B: `Overlay service disconnected from runtime.` → **Try again later**
- Variant C: `Live overlay module is not available.` → **Try again later**
- First-user fallback: `Overlay is currently offline.` → **Try again later**

---

## Repetition avoidance rule
- Rotate variants by widget and state (at least 2–3 options available, no fixed single sentence).
- Keep terminology consistent (`source`, `module`, `reload`) while varying flavor text.
- Never rotate CTAs into ambiguous labels.

## CTA clarity QA checklist
Before release, verify each visible state copy:
1. Exactly one primary CTA is present.
2. CTA text matches one of: `Check source`, `Reload`, `Try again later`.
3. CTA maps to real behavior in that widget.
4. Critical error messages contain no sarcasm or playful blame.
5. A first-user fallback (no insider terms) exists for each state.

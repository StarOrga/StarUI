# StarUI Web Components (layer 2, behaviour)

Format decision (2026-11-21): two levels.

1. **Base — CSS classes + tokens** (`lib/`, `layers/`). Every component exists here
   first. Works in Angular, plain HTML, the installer and the Electron host shell.
2. **On top — Web Components** for components that carry *behaviour* (dropdown,
   tabs, tooltip trigger, toast, dialog). A Web Component renders the same CSS
   classes from level 1, so a surface that cannot run it still gets the look.

Rules:
- A Web Component never introduces a look that level 1 does not have.
- Tag prefix `star-` (e.g. `<star-tabs>`). Light DOM, no Shadow DOM for styling,
  so the level-1 classes and each surface's tokens apply.
- Each component gets a catalog entry with `"format": ["css", "web-component"]`
  and starts as `experimental`.

No Web Component is shipped yet. The first candidates are the catalog entries
whose `format` lists `"web-component"`.

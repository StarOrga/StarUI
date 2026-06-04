# StarUI

Shared design system for the **StarOrga / Star Citizen Companion** ecosystem.
RSI-inspired visual language — sharp edges, cyan glows over drop shadows, dense
spacing, motion as feedback. One source of truth for every StarOrga surface
(desktop app, web, uploader, installer).

> **Master source:** the Star Citizen Companion desktop app. Tokens and styles
> originate there and flow outward through this package — never the reverse.

## Install

StarUI is consumed as a **git dependency** (no registry, no auth token — works
on Vercel and local builds out of the box):

```jsonc
// package.json
"dependencies": {
  "@starorga/star-ui": "github:StarOrga/StarUI#v0.1.0"
}
```

Pin to a tag (`#v0.1.0`) and bump deliberately. `main` is the development line.

## Use

### Build-capable consumers (Angular, bundlers)

Import the individual layers you need from `lib/`:

```css
@import "@starorga/star-ui/lib/design-tokens.css";   /* required first — colors, type, spacing, radius */
@import "@starorga/star-ui/lib/cursor-tokens.css";
@import "@starorga/star-ui/lib/control-states.css";
@import "@starorga/star-ui/lib/forms.css";
@import "@starorga/star-ui/lib/status.css";
@import "@starorga/star-ui/lib/tooltips.css";
@import "@starorga/star-ui/lib/app-scrollbars.css";
@import "@starorga/star-ui/lib/window-surface.css";
@import "@starorga/star-ui/lib/settings-block.css";
@import "@starorga/star-ui/lib/logo-animations.css";
```

Desktop-shell layout (app-specific) lives under `shell/`.

### Plain-HTML consumers (e.g. installer)

Link the prebuilt single-file bundle:

```html
<link rel="stylesheet" href="node_modules/@starorga/star-ui/dist/star-ui.css">
```

## Layout

| Path     | Contents                                                              |
|----------|----------------------------------------------------------------------|
| `lib/`   | Framework-agnostic CSS: tokens, control states, forms, scrollbars, tooltips, status, motion, plus canvas/cursor JS utilities. |
| `shell/` | Desktop-shell layout + theme overrides (desktop-app-specific).        |
| `dist/`  | Generated single-file bundle (`star-ui.css`). Built from `lib/`.       |
| `assets/`| Icons, tray-state icons, brand logos, provider icons.                 |
| `docs/`  | Design-system catalog, styleguide, token-layer + cursor/radius rules. |
| `preview/`| Interactive Design System Explorer (`index.html`) + asset browser.   |

## Develop

```bash
npm run build      # regenerate dist/star-ui.css from lib/
npm run preview    # serve the Design System Explorer at http://localhost:4173
```

## Versioning

Tags are the release surface. Patch = token/style fix, minor = additive, major =
breaking token rename/removal. Update consumers by bumping the `#vX.Y.Z` ref.

## License

Apache-2.0 — see [LICENSE](./LICENSE).

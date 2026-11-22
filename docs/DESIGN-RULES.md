# StarUI — design rules for people and for Claude

How the StarOrga design system is organised, how a surface uses it, and how
something **new** gets in without the system turning into a cage.
Decided in the concept "Design-System Angleichung" (2026-11-21).

The single most important rule: **deviations are allowed, hidden deviations are not.**

## 1. Layers

| Layer | What | File |
|---|---|---|
| **core** | Tokens every surface shares (colour, type families, radius, shadow, motion) and all brand files | `layers/core.css`, `assets/brand/` |
| **components** | Building blocks used by web **and** desktop | `layers/components.css`, `components/` |
| **desktop** | Electron surfaces only (app, Data Uploader, installer) | `layers/desktop.css`, `shell/` |
| **web** | Web PWA only | `layers/web.css` |

The `layers/*.css` files are indexes over `lib/`. The `lib/` paths stay valid,
so every existing import keeps working.

Each surface keeps its own look on top: the web stays light and rounded, the
app stays dense and sharp. StarUI shares the *system* (tokens, scales, brand,
building blocks), not one look.

## 2. Format: two levels

1. **CSS classes + tokens** — the base for every component.
2. **Web Components** (`<star-…>`) only on top, for components with behaviour.
   They render the level-1 classes, so they never bring a look of their own.
   Details: `components/README.md`.

## 3. Brand

StarUI is the single source of truth for logos, marks and app icons. A consumer
copies or links from `assets/brand/`, never the other way round. A brand file a
consumer needs that StarUI lacks is added to StarUI first.

## 4. Status: stable and experimental

Every building block has a catalog entry (`catalog/catalog.json`, rendered as
`docs/CATALOG.md`) with layer, format, status and the surfaces that use it.

- **stable** — in StarUI, documented, used.
- **experimental** — new, or a variant, or something a surface deliberately
  does differently. It may live in StarUI (file marked `EXPERIMENTAL`) or still
  in the consumer (`"home": "web"`).
- **deprecated** — kept for compatibility, not for new code.

## 5. Something new: the `ds-new` flow

Inventing is welcome. When a surface needs something the catalog does not have
(a new component, a variant, a value off the scale):

1. **Build it** in the surface where it is needed, on StarUI tokens where they fit.
2. **Mark it** in the code, at the definition:
   ```css
   /* ds-new: pill filter chip for the admin list, no StarUI chip yet */
   ```
   ```html
   <!-- ds-new: two-line tab label for the holo table -->
   ```
3. **Register it** as an `experimental` catalog entry (`"home"` = the surface),
   in the same PR in StarUI or as a follow-up issue there.
4. **Say it** in the PR or the reply: "new / deviates from StarUI: …".

A deliberate local look that should *not* go to StarUI is marked
`ds-ok: <reason>` instead. Both pragmas stop the inventory and the surface's
lint from counting the line as drift. A line with neither is drift.

## 6. Promotion: experimental → StarUI stable

An experimental entry is promoted once **two surfaces need it** (web + app,
app + uploader, …). Promotion means: move it into the right layer, document
it, release a minor version, then bump the consumers.

Spacing and other scales do not promote value by value. A spacing step counts
as "needed by two surfaces" when both use **the same step for the same role**
(e.g. card padding `--ds-space-4`), not when the same pixel number happens to
appear twice. Scales themselves (`core.scale`) are promoted as a whole once two
surfaces read them.

## 7. Inventory

`npm run inventory -- --surface web=<path> --surface app=<path> …` scans the
surfaces and lists every deviation: brand copies, copies of StarUI CSS, radius
off the scale, font sizes below 13px, raw hex colours, button families and the
`ds-new` register. The latest report lives in `docs/inventory/latest/`.

## 8. For Claude

Before UI work on any surface, read that surface's design-system section in
its `CLAUDE.md` and this file. Then:

- use what the catalog has; when it does not fit, build the new thing and mark
  it `ds-new` (rule 5), never silently bend an existing token;
- never invent a new colour literal or radius when a token fits;
- say every deviation out loud in the reply;
- do not refuse a good idea because it is not in the catalog. Being too strict
  is a failure too.

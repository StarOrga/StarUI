# Changelog

All notable changes to `@starorga/star-ui`. Each version is a git tag that
consumers pin: `github:StarOrga/StarUI#vX.Y.Z`.

## [0.2.0] — 2026-09-26

StarUI is now the master of the design system: tokens, shell styles and brand
assets live here, and the apps consume them through the pinned tag.

### Changed
- `--text-tertiary` `#5a7a94` → `#84a0b6`: meets WCAG AA (5.71:1 on
  `--surface-canvas`, 4.89:1 on `--surface-panel`; was 3.45:1 / 2.96:1).
- Scatter-tile images use the brighter grade the app intended:
  `--scatter-tile-img-filter`, `--scatter-tile-img-filter-hover`,
  `--scatter-tile-overlay-gradient`.
- Shell layout tokens `--layout-top-padding` and `--layout-section-gap` are
  responsive `clamp()` values.
- Brand assets regenerated from the desktop app: app icon in 8 sizes (16–512)
  plus `.ico`; tray icon as 7 states, each at 16/20/24/32 px with a dedicated
  small-size mark.
- Docs brought up to date with the apps; stale source paths point at
  `@starorga/star-ui/…`; README and CLAUDE.md name StarUI as the master.

### Added
- `--keyboard-focus-glow` focus-ring token.
- `shell/desktop-shell-base.css` defines the 9 `--window-desktop-*` tokens it
  consumes, plus `--layout-section-gap-outer`, `--layout-section-gap-inner`
  and `--layout-divider-gap`.
- `npm run gen:icons` (`scripts/gen-app-icons.js`); `sharp` is a
  devDependency, so consumers never install it.
- `--accent-danger` usage guideline: danger text and icons on canvas or panel
  use `--accent-danger-light`.

### Fixed
- The preview explorer loads StarUI's own `lib/` and `assets/` — it pointed
  at the app's old paths and rendered unstyled.
- AI-tooling runtime state and secrets are git-ignored.

## [0.1.1] — 2026-06-05

### Added
- Accent and status RGB channel tokens (`--accent-primary-rgb`,
  `--accent-gold-rgb`, `--accent-warning-rgb`, `--status-success-rgb`, …) for
  `rgba()` use, and the `--accent-hot` orange (`#ff5722`).

### Changed
- Declared license aligned to MIT; `.editorconfig`, CLAUDE.md index and a CI
  bundle build-check added.

## [0.1.0] — 2026-06-04

### Added
- Initial StarUI design system, extracted from the SCC desktop app: design and
  cursor tokens, control states, forms, settings block, window surface, status,
  tooltips, scrollbars, logo animations, desktop shell, brand assets, docs and
  the preview explorer. LF line endings enforced for byte-identical checkouts.

# Capture Picker Surface Ownership (Angular-only)

## Renderer policy

The overlay capture picker surface is owned by Angular and must not use legacy HTML renderer files.

- Runtime entrypoint in Electron main process: `modules/desktop/src/main.js` resolves `ui-angular/dist/capture-picker/browser/index.html`.
- Source of truth for UI logic: `modules/desktop/ui-angular/src/capture-picker/*`.
- Legacy `modules/desktop/src/overlay-capture-picker.html` has been removed.

This enforces the repository policy that all UI surfaces are rendered with Angular.

## Surface ownership boundaries

- **Desktop shell surface**: `modules/desktop/ui-angular/src/app/*` (`ui-angular` bundle)
- **Capture picker surface**: `modules/desktop/ui-angular/src/capture-picker/*` (`capture-picker` bundle)

The capture picker owns:

- drag-selection interaction state
- fullscreen/area mode toggle state
- metadata dialog lifecycle
- IPC flows for `overlay:capture-picker:init`, `overlay:capture-picker:finish`, and `overlay:capture-picker:cancel`

The Electron main process remains the authority for:

- screenshot source acquisition
- BrowserWindow lifecycle
- persistence of capture payloads

## Packaging strategy

`modules/desktop/ui-angular/angular.json` defines a dedicated `capture-picker` Angular application build target with its own index/main/styles.

`modules/desktop/ui-angular/package.json` builds both surfaces in one command:

- `ng build ui-angular`
- `ng build capture-picker`

This keeps bundle boundaries explicit while preserving a single desktop build pipeline.

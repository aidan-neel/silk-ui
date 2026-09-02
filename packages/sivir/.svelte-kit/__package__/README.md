# Sivir

Small, copyable UI primitives and supporting theme utilities.

## Layout

- `components/`: Svelte components plus small TypeScript entrypoints and variant definitions.
- `themes/`: Theme utility types, CSS generation, and live theme hydration helpers.
- `ui.css`: Design tokens plus the shared surface contracts (`.sivir-menu-item`, `.sivir-card-frame`, `.sivir-card-surface`, `.sivir-modal-frame`, `.sivir-inset-frame`, `.sivir-inset-surface`, `.sivir-tooltip`).
- `utils.ts`: Shared class, context, focus, and interaction helpers.
- `transition.ts`: Panel, dialog, overlay, and sheet transitions driven by CSS motion variables.
- `is-dark.svelte.ts`: Reactive `.dark` detection for the components that branch on colour scheme.

Everything above is copied verbatim into a consumer project by `sivir init` and
`sivir add`, so it is the surface that has to stay small and legible.

## Notes

- Components are designed to be copied and adjusted without a large abstraction layer.
- Styling that more than one component shares lives in `ui.css`, not in a shared TypeScript
  class string. A component names the contract (`class="sivir-menu-item"`) and the stylesheet
  owns it. The `components` layer sits below `utilities`, so a consumer's own Tailwind classes
  still win on every property they name.
- Theme utility logic lives in TypeScript so studio state and generated CSS stay in sync.
- Helpers stay intentionally small so behavior is easy to trace when something needs to change.

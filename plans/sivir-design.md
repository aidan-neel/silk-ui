# Sivir Design

**Status:** Approved for MVP implementation

**Updated:** 2026-08-27

**Product:** A local-first visual editor for responsive Svelte interfaces built
with Sivir UI.

## 1. Product Decision

Sivir Design is a simpler, deliberately narrower alternative to a Figma-like
editor. It lets developers and product designers compose responsive web
screens from semantic layout primitives and real Sivir components, inspect the
result at multiple viewport widths, and export readable Svelte 5 code.

The editor is not a vector canvas or a hosted no-code website builder. The
canonical artifact is a semantic, responsive document tree. Normal document
flow, grid, flex layout, component slots, and accessible source order replace
arbitrary coordinates.

The initial product is:

| Decision | MVP choice |
| --- | --- |
| Product surface | Standalone `apps/design` SvelteKit application |
| Storage | Local-first IndexedDB with portable project files |
| Canvas | Responsive semantic layout, not freeform positioning |
| Output | Deterministic Svelte 5, Tailwind v4, and Sivir package imports |
| Accounts | None |
| Backend | None |
| Collaboration | None |
| Catalog | Curated editor-safe subset, expanded through adapters |
| Import | Sivir Design project JSON only |

## 2. Product Promise

> Compose one responsive interface with real Sivir components, then continue
> from source code instead of rebuilding the mockup.

A successful first session lets a user:

1. Create or open a local project.
2. Insert semantic layout, text, and Sivir component nodes.
3. Reorder and configure the document through the canvas, outline, and
   inspector.
4. Add sparse mobile, medium, and large layout overrides.
5. Exercise real component behavior in Preview mode.
6. Save automatically without an account or network.
7. Export a portable design file or readable Svelte source.

## 3. Users and Jobs

### Primary users

- Design engineers and Svelte developers sketching realistic product screens.
- Product designers working inside a Sivir-based implementation system.
- Small product teams that need credible responsive prototypes without a
  general-purpose design suite.
- Sivir maintainers testing components in representative compositions.

### Jobs to be done

- Establish content hierarchy, semantics, alignment, density, and responsive
  behavior before writing application code.
- Explore valid Sivir variants and initial states without memorizing every API.
- Communicate a screen or flow through a portable local artifact.
- Validate focus, overlays, dark mode, and narrow layouts with real components.
- Generate a clean starting point that a developer can safely own.

## 4. Product Principles

1. **Flow before coordinates.** Normal flow, stack, row, grid, wrapping, and
   width constraints are the layout language.
2. **One responsive truth.** A screen has one semantic tree and sparse
   mobile-first overrides, not separate desktop and mobile copies.
3. **Real components.** Preview uses the actual Svelte components and preserves
   their keyboard and accessibility behavior.
4. **Closed data model.** Documents contain JSON values only. Functions,
   snippets, refs, DOM nodes, files, promises, and streams remain adapter
   implementation details.
5. **Semantics are authored.** Landmarks, heading order, labels, alternative
   text, and source order are represented explicitly.
6. **Spacing has one owner.** Parent gap and padding controls replace spacer
   nodes and arbitrary child margins.
7. **Export is the finish line.** Generated code has no Sivir Design runtime
   dependency and is deterministic for the same document and catalog version.
8. **Local ownership.** Core creation, editing, saving, previewing, and export
   work offline.
9. **Progressive disclosure.** The inspector shows controls relevant to the
   current node and breakpoint rather than every possible CSS property.
10. **Restraint.** Editor chrome follows `DESIGN.md`: typography, alignment,
    dividers, and density communicate structure before surfaces or effects.

## 5. Deliberate Differences

| Product category | Sivir Design boundary |
| --- | --- |
| Figma | No vectors, arbitrary coordinates, rotation, independent device frames, or handoff-only document model |
| Framer | No hosting, domains, animation timelines, CMS, or proprietary runtime |
| Page builders | No template marketplace, block soup, production publishing, or generic marketing presets |
| IDE | Faster composition and responsive exploration, while export remains the path into unrestricted code |

The responsive width ruler is the signature interaction. Scrubbing it should
make the same semantic screen visibly recompose around the fixed breakpoints.

## 6. MVP Scope

### Included

- Local project browser with create, open, duplicate, delete, recent, and
  recovery states.
- Multiple screens per project with names and route hints.
- Semantic Page, Section, Header, Main, Navigation, Aside, Footer, Container,
  Stack, Row, Grid, Text, and Image authoring nodes.
- Searchable component insertion, semantic outline, canvas selection,
  inspector editing, move, duplicate, and delete.
- Base, medium, and large responsive scopes.
- One scrub-able viewport from 320px to 1920px with 390px, 768px, and 1440px
  presets.
- Project theme controls using the existing versioned Sivir `Theme` contract.
- Separate Select and Preview interaction modes.
- Undo and redo for persistent edits.
- IndexedDB autosave, revision checks, previous-valid recovery, and a clear
  memory-only fallback.
- Portable `.sivir-design.json` import and export.
- Deterministic Svelte component export using package imports.
- Keyboard access to every structural operation.

### Curated component catalog

The first complete catalog contains twelve lower-risk component families:

`Alert`, `Avatar`, `Badge`, `Button`, `Card`, `Checkbox`, `Input`, `Label`,
`Progress`, `Skeleton`, `Switch`, and `Textarea`.

Three architecture spikes must pass before the MVP is considered complete:

- `Card` proves structured compound parts and named slots.
- `Modal` proves iframe-contained portals, focus trapping, and body locking.
- `Select` proves controlled state, collection data, and an overlay menu.

Modal and Select may remain marked experimental in the insert browser until
their preview and export adapters meet the same gates as the twelve supported
families.

### Explicit non-goals

- Arbitrary CSS, Tailwind class, HTML, Svelte, or JavaScript entry.
- Absolute positioning, vector drawing, rotation, overlap, or z-index editing.
- Importing or round-tripping arbitrary Svelte source.
- Binary asset uploads in the MVP. Images use HTTPS URLs or placeholders.
- Application data, API calls, form submission, authentication, or custom
  business logic.
- Cloud sync, accounts, comments, sharing, collaboration, or publishing.
- CLI source-copy export.
- Plugins, private component catalogs, or a template marketplace.
- Animation timelines or arbitrary interaction graphs.
- Persisted branching history.

## 7. Information Architecture

### Start

The start surface is a compact project list with New project, Open project,
recovery notices, and recent files. It does not include cloud, team, billing,
or marketplace navigation.

### Editor

Desktop composition:

```text
Project / Screen        Viewport and zoom          Preview   Export
-------------------------------------------------------------------
Screens and outline |       responsive canvas       | Inspector
                    |         preview iframe         |
```

- The top bar owns project identity, save status, undo, redo, viewport,
  preview, and export.
- The left region owns screens and the canonical semantic outline.
- Insert search temporarily replaces the outline instead of adding a second
  permanent rail.
- The canvas remains the dominant object.
- The right region is a contextual inspector with explicit inherited-value
  indicators.
- At narrow app widths, the side regions become mutually exclusive drawers.

### Preview and export review

Preview removes selection affordances and enables real component behavior.
Export review lists generated files, target versions, dependencies, blocking
structural errors, and non-blocking warnings.

## 8. Responsive Model

The fixed MVP breakpoints are:

| Scope | Range | Export |
| --- | --- | --- |
| Base | Below 768px | Unprefixed classes |
| Medium | 768px and above | `md:` classes |
| Large | 1024px and above | `lg:` classes |

Rules:

- Base is required for every responsive property.
- Medium and Large store sparse overrides and inherit when absent.
- Reset removes the override instead of copying another scope's value.
- Content, semantics, identity, and source order are shared across scopes.
- Breakpoint-specific source reordering is prohibited.
- Visibility overrides produce an audit warning for meaningful content or
  controls.
- The preview checks widths immediately before and after each boundary.

The finite editable layout vocabulary includes display mode, direction,
columns, gap, alignment, justification, wrapping, width, max-width, minimum
height, padding, surface, border, radius, and visibility. Runtime Tailwind
class construction is prohibited. Preview and export use one literal class
mapping that Tailwind can scan.

## 9. Component Browser and Inspector

The browser is a keyboard-first searchable list grouped by Structure, Content,
Forms, Navigation, Feedback, and Overlays. It shows a compact live example for
the active row rather than a grid of component cards.

Every supported component family has an app-private authoring contract:

- Stable family, part, template, and adapter IDs.
- Package import style and symbol.
- Editable JSON prop controls and defaults.
- Allowed parents, slots, cardinality, and legal child kinds.
- Initial state and supported declarative interactions.
- Selection and resize capabilities.
- Portal behavior.
- Preview adapter.
- Code generation adapter.
- Adapter version and migration.

Inspector sections are Selection, Content, Component, Layout, Typography,
Appearance, Accessibility, and Interaction. MVP intentionally excludes raw
class and style fields, arbitrary shadows, one-off colors, and arbitrary
radii.

## 10. System Architecture

```text
Editor host
  -> validated command
  -> pure document reducer
  -> canonical DesignDocument
       -> IndexedDB repository
       -> preview projection and MessageChannel
       -> pure Svelte generator

Preview iframe
  -> actual Sivir components
  -> hit testing, geometry, drop proposals, and selection overlays
  -> no persistence and no canonical state
```

### Workspace boundary

All MVP product code remains private in `apps/design`. No public export is
added to `@sivir-ui/svelte`. A shared `packages/design-core` is considered only
when a second real consumer exists.

Suggested modules:

```text
apps/design/src/lib/
  catalog/
  codegen/
  document/
  editor/
  layout/
  persistence/
  preview/
  ui/
```

### Canonical state

The host frame is the only owner of canonical project state and the only
IndexedDB writer. The iframe receives validated page snapshots or revisioned
patches. It never reads browser storage.

### Preview isolation

The preview runs at `/preview` in a sandboxed iframe. This isolates global
theme selectors, body portals, focus traps, inert state, scroll locks, z-index,
and component-level errors from the editor chrome.

The host transfers a `MessagePort` after a versioned handshake. Every message
is runtime validated and includes a session or revision identity. Version or
revision mismatches request a full resynchronization.

The host does not reach into iframe DOM. The preview reports selection intent,
drop proposals, resize intent, geometry, render acknowledgements, and
diagnostics.

## 11. Document Contract

Document, database, catalog, adapter, preview protocol, theme, package, and
generator versions are independent.

The closed JSON document has this shape:

```ts
type Responsive<T> = {
    base: T;
    md?: T;
    lg?: T;
};

type DesignDocument = {
    format: 'sivir-design/document';
    schemaVersion: 1;
    id: string;
    name: string;
    compatibility: {
        catalogVersion: string;
        sivirPackageVersion: string;
        generatorVersion: string;
    };
    appearance: {
        theme: Theme;
        colorMode: 'light' | 'dark';
    };
    pages: DesignPage[];
    nodes: Record<string, LayoutNode | TextNode | ImageNode | ComponentNode>;
};
```

Layout nodes own ordered children. Component nodes own adapter-approved props
and named ordered slots. Parent references are derived in memory instead of
persisted redundantly.

Validation rejects cycles, shared children, unreachable nodes, unknown parts,
invalid props, invalid slots, missing base values, unknown breakpoints, unsafe
URLs, unsafe theme font strings, excessive depth, and excessive node counts.
Unknown future nodes are preserved as recoverable placeholders and block code
generation instead of disappearing.

## 12. Commands and History

Persistent edits are commands over immutable documents. Supported command
families include page insertion and removal, node insertion and removal, move,
duplicate, rename, text update, component prop update, layout value update,
responsive override removal, theme update, and atomic batches.

Every applied command returns an inverse command and affected IDs. History:

- Keeps at most 100 entries or roughly 20MB.
- Is session-only in the MVP.
- Restores selection on undo and redo.
- Coalesces text entry and continuous controls into transactions.
- Commits one entry for a drag, resize, or template insertion.
- Clears redo after a new forward edit.
- Never mutates the document during a drag preview.

## 13. Direct Manipulation

- Canvas and outline selection remain synchronized.
- Clicking selects the deepest authored node; Escape selects its parent.
- Dragging shows legal insertion lines and named slot targets.
- Invalid destinations are unavailable and are never silently repaired.
- Compound required parts cannot be detached or moved into invalid contexts.
- Container edges snap to semantic width and maximum-width tokens.
- Grid resizing changes column span, not pixel width.
- Keyboard operations can insert, move before or after, move into a container,
  move out, duplicate, and delete.
- Select mode suppresses navigation and component activation.
- Preview mode enables real interaction and keeps interaction state ephemeral.

Cross-iframe drag uses custom pointer sessions, not native HTML drag and drop.
The host sends iframe-relative points, the preview computes a visual candidate,
and the host revalidates the proposed document location before dispatching a
single command.

## 14. Persistence and Recovery

The IndexedDB database stores project metadata, one atomic current document,
recovery records, settings, and active project leases. Database schema and
document schema migrations are separate.

Persistence rules:

- Autosave 250 to 500ms after the final persistent command.
- Save metadata and document in one read-write transaction.
- Compare the expected monotonic revision before writing.
- Keep the previous valid revision as recovery data.
- Never clear dirty state after a failed save.
- Detect active tabs with `BroadcastChannel`, but use database revision checks
  as the authority.
- Open a concurrently edited project read-only by default.
- Preserve conflicts as recoveries before offering reload or duplication.
- Enter a clearly labeled memory-only mode when IndexedDB is unavailable.
- Keep JSON and Svelte export available during storage failures.
- Never silently delete malformed data.

Before a migration, the untouched input is saved to recovery storage. Pure
migrations run in order and the result is committed only after complete
validation.

## 15. Import and Export

### Project files

Portable project files use a versioned `.sivir-design.json` envelope. Import
parses and validates entirely in memory, shows a compatibility summary, and
creates a new local project only after confirmation. Import never overwrites an
existing project by default.

Initial limits are 10MB, 5,000 nodes, 100 pages, depth 100, 100,000 characters
per string, and 2MB total text.

### Svelte generation

The generator is a pure function of normalized document content, catalog
version, generator version, and target version. Repeated generation produces
byte-identical files.

Generation rules:

- Semantic primitives become semantic HTML.
- Component instances import only public `@sivir-ui/svelte` APIs.
- Imports, props, classes, files, and line endings have canonical order.
- Only literal precompiled Tailwind classes are emitted.
- Theme output comes from the existing `themeToCss()` contract.
- No timestamp, revision, editor ID, or random value enters generated source.
- No Sivir Design runtime or JSON renderer is emitted.
- Mechanically invalid accessibility or composition states block export.
- Re-export overwrites only files tracked by its prior export manifest.

The initial output is one Svelte screen component plus integration guidance and
optional theme CSS. Full project scaffolding and CLI source-copy output are
future work.

## 16. Security

- No imported executable code is evaluated.
- Document props are allowlisted JSON values.
- URLs permit HTTPS and validated relative paths only.
- Imported theme font values reject semicolons, braces, at-rules, comments,
  escapes, control characters, and `url()`.
- Iframe messages validate origin, source, session, protocol, revision, and
  payload schema.
- Preview navigation, popups, downloads, storage, and top navigation are not
  granted through sandbox permissions.
- Imported files are bounded before full parsing and reject prototype-polluting
  keys.

## 17. Accessibility

The editor and generated screens target WCAG 2.2 AA.

- The outline is the canonical screen-reader editing surface.
- Native Tab order remains available; single-letter shortcuts are disabled
  while typing.
- Every direct manipulation has a keyboard operation.
- Focus returns predictably after panels and dialogs.
- Selection and diagnostics never rely on color alone.
- Reduced motion is respected in host and preview.
- Generated screens preserve landmarks, heading order, label associations,
  accessible names, alternative text, source order, focus behavior, and Sivir
  component semantics.

Unnamed controls, unlabeled fields, invalid component structure, and images
without alternative text or an explicit decorative designation block export.
Heading progression and responsive hidden-content concerns remain warnings.

## 18. Performance Budgets

- A 10-screen, 500-node project opens in under two seconds on reference
  hardware.
- Width scrubbing and selection overlays remain visually immediate.
- Preview patches coalesce to one animation frame.
- Reducers clone only touched records.
- Production validates affected regions after a command and periodically runs a
  full audit.
- The catalog and preview adapters are statically split so the editor host does
  not eagerly load every Svelte component.

## 19. Verification Strategy

### Unit

- Document parsing, invariants, and migration fixtures.
- Command forward and inverse behavior.
- One hundred mixed undo and redo operations returning the same content hash.
- Responsive inheritance and class resolution.
- Catalog prop, slot, template, and adapter completeness.
- Stable project JSON and deterministic Svelte generation.
- Persistence revisions, conflicts, recovery, and memory-only behavior.

### Browser

- Host and preview handshake, resynchronization, and iframe reload.
- Selection, drag proposals, keyboard move, resize, and breakpoint editing.
- IndexedDB save, reopen, quota failure, migration failure, and cross-tab
  conflict.
- Real Button, form control, Card, Modal, and Select interactions.
- Parent editor isolation from theme CSS, portals, focus traps, body locks, and
  overlay state.
- Axe checks and keyboard-only completion of core workflows.

### Export

- Golden files for every supported component template.
- One hundred repeated exports produce one SHA-256 per fixture.
- Every golden export type-checks and builds in a fresh supported consumer.
- Preview and generated output agree at 390px, 768px, and 1440px.
- Every emitted Tailwind class exists literally in the generated class matrix.

## 20. Delivery Phases

### Phase 0: Contract and risk spikes

- Reconcile the package, CLI, docs, and design catalog inventories.
- Lock document, catalog, adapter, protocol, and generator versioning.
- Prove leaf, compound, controlled, portal, and collection adapters.
- Prove iframe theme, focus, body-lock, and portal isolation.
- Prove literal Tailwind class availability in production output.

**Gate:** all architecture spikes pass without executable document values or
parent-frame mutation.

### Phase 1: Core document and local projects

- Build document validation, catalog, templates, command reducer, history,
  IndexedDB repository, recovery, and portable project files.
- Ship Start and project lifecycle states.

**Gate:** supported projects round-trip exactly, malformed projects remain
recoverable, and stale writes are rejected.

### Phase 2: Responsive editor

- Build the editor composition, outline, insertion, inspector, responsive
  scopes, keyboard operations, selection, move, resize, and theme controls.
- Add the isolated preview runtime and protocol.

**Gate:** a keyboard-only user can complete the primary composition workflow,
and a 500-node reference document stays within performance budgets.

### Phase 3: Catalog and code generation

- Complete the twelve supported adapters and the Modal and Select spikes.
- Implement deterministic Svelte generation, accessibility preflight, export
  review, and generated-consumer fixtures.

**Gate:** every supported fixture has preview/export parity and compiles in a
fresh consumer.

### Phase 4: Hardening and preview release

- Add recovery UX, corruption handling, cross-tab protection, browser matrix,
  reduced motion, visual baselines, onboarding, and local opt-in metrics.
- Document limitations and upgrade policy.

**Gate:** no open P0 or P1 issue in data durability, export correctness,
accessibility, isolation, or the primary workflow.

## 21. V1 and Later

V1 may add synchronized multi-viewport comparison, reusable local blocks,
local binary assets, richer prototype links, more adapters, custom project
starters, inline text editing, and full coverage of the 55-family public
catalog.

Post-v1 research may consider custom component catalogs, a Git-friendly
unpacked document form, carefully bounded prototype variables, cloud sync, and
shareable prototypes. These remain conditional on preserving readable export
and the closed data model.

## 22. Release Acceptance

The MVP is complete when:

1. Creation, editing, save, reopen, preview, project export, and Svelte export
   work without networking or an account.
2. Forced reload restores the last acknowledged revision without corrupting the
   previous valid revision.
3. Outline, canvas, preview, and generator consume one canonical semantic tree.
4. All primitives and twelve supported families can be inserted, configured,
   moved, duplicated, deleted, and undone by keyboard.
5. Invalid component structures cannot be created through the UI, move, paste,
   or project import.
6. Responsive values inherit and reset predictably and generate mobile-first
   literal classes.
7. The preview remains isolated from parent theme, portal, focus, body-lock,
   and overlay effects.
8. Generated source is deterministic, formatted, public-API-only, free of an
   editor runtime, and valid in the supported SvelteKit consumer.
9. Mechanically certain accessibility failures block export with a direct path
   to the responsible node.
10. Storage, quota, conflict, corruption, migration, and export failures retain
    user work and present a specific recovery action.
11. The editor meets keyboard, focus, contrast, reduced-motion, and responsive
    requirements in `DESIGN.md`.
12. Required repository formatting and lint gates pass.

## 23. Scope Circuit Breakers

Stop expansion and finish the current vertical slice when any of these occur:

- A component requires raw code in the document to be useful.
- Preview behavior cannot match export without a hidden runtime.
- A selection wrapper changes component semantics or layout.
- A generated Tailwind value is not statically present in production CSS.
- A migration cannot preserve unknown data losslessly.
- A persistence path can acknowledge a save before durable commit.
- Broader catalog coverage threatens recovery, export determinism, isolation,
  or accessibility gates.

The product earns breadth only after the document, preview, persistence, and
export contracts are dependable.

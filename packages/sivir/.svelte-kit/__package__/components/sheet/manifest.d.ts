import type { Manifest } from '@sivir-ui/svelte/_manifest/types';
/**
 * Sheet -- side-anchored slide-in panel. Composes `_internal/overlay` for
 * the shared focus-trap / click-outside / Escape / body-scroll-lock
 * concerns and uses Svelte transitions for its directional enter/exit motion.
 *
 * Version history:
 *   1.0.0 -- initial manifest. Sheet-content consumes `_internal/overlay`
 *           (resolves F-30). The public component API (Root, Content,
 *           Trigger, Title, Description, Header, Footer, Close) and the
 *           `side`/`allowClickOutside` props are stable.
 */
export declare const manifest: Manifest;

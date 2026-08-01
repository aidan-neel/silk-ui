import type { Manifest } from '@sivir-ui/svelte/_manifest/types';
/**
 * Modal -- centered dialog overlay. Composes `_internal/overlay` for the
 * shared focus-trap / click-outside / Escape / body-scroll-lock concerns;
 * owns its own portal, Svelte enter/exit transitions, and centered positioning.
 *
 * Wrapped by `alert-dialog`.
 *
 * Version history:
 *   1.0.0 -- initial manifest. Modal-content consumes `_internal/overlay`
 *           (resolves F-30). The public component API (Root, Content,
 *           Trigger, Title, Description, Header, Body, Close, Footer,
 *           Confirm) is stable.
 */
export declare const manifest: Manifest;

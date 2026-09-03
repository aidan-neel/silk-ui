import type { Manifest } from '@sivir-ui/svelte/_manifest/types';
/**
 * Tooltip uses one shared floating surface per document, so every instance
 * avoids its own portal and positioning lifecycle. Trigger/Content preserve
 * the public composition API while Content supplies the accessible label.
 *
 * 2.1.0 -- in-place re-labels (e.g. Copy→Copied) roll via @scritto/core.
 */
export declare const manifest: Manifest;

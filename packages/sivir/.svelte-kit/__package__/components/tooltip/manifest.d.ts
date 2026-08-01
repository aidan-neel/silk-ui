import type { Manifest } from '@sivir-ui/svelte/_manifest/types';
/**
 * Tooltip uses one shared floating surface per document, so every instance
 * avoids its own portal and positioning lifecycle. Trigger/Content preserve
 * the public composition API while Content supplies the accessible label.
 */
export declare const manifest: Manifest;

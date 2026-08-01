import type { Manifest } from '@sivir-ui/svelte/_manifest/types';
/**
 * Combobox.
 *
 * 1.0.0 -- initial.
 * 2.0.0 a11y fixes: aria-required-children resolved by moving
 *        role="listbox" off Popover.Content (now role="none") onto the
 *        inner combobox-results wrapper with an explicit id
 *        (combobox-${key}-listbox); combobox-trigger now provides a
 *        robust aria-label fallback when no selection is made.
 */
export declare const manifest: Manifest;

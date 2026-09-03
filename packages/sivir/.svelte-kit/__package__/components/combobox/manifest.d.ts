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
 * 2.3.0: trigger gains `appearance="input"` (field-styled, always-editable,
 *        opens on focus/typing instead of click-toggle, no chevron) plus an
 *        optional `trailing` adornment snippet. Input appearance shows a
 *        built-in clear button while a query or selection is present,
 *        preserves the selection as the editable query on open, and skips
 *        the popover dismiss layer so the trigger stays clickable.
 */
export declare const manifest: Manifest;

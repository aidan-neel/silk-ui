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
export const manifest: Manifest = {
    name: 'combobox',
    version: '2.3.0',
    visibility: 'public',
    description: 'Searchable popover-based picker with fuzzy results via fuse.js.',
    files: [
        'components/combobox/combobox.svelte',
        'components/combobox/combobox-trigger.svelte',
        'components/combobox/combobox-content.svelte',
        'components/combobox/combobox-search.svelte',
        'components/combobox/combobox-results.svelte',
        'components/combobox/combobox-item.svelte',
        'components/combobox/combobox-label.svelte',
        'components/combobox/context.svelte.ts',
        'components/combobox/index.ts',
        'components/combobox/manifest.ts'
    ],
    components: ['popover', 'button', 'input', 'scroll-area'],
    shared: ['utils.cn', 'utils.createContext'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        'fuse.js': '^7.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

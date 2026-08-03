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
export const manifest: Manifest = {
    name: 'combobox',
    version: '2.1.0',
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
    components: ['popover', 'button'],
    shared: ['utils.cn', 'utils.createContext'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        'fuse.js': '^7.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

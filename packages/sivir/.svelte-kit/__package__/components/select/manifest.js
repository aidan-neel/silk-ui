/**
 * Select.
 *
 * 1.0.0 -- initial.
 * 2.0.0 a11y fixes:
 *        - select-trigger always sets aria-label (robust fallback).
 *        - aria-modal no longer applied for role="listbox" (only
 *          dialog/alertdialog get it).
 */
export const manifest = {
    name: 'select',
    version: '2.2.0',
    visibility: 'public',
    description: 'Listbox-based single-select with bindable value and Item/Label/Content subparts.',
    role: 'listbox',
    files: [
        'components/select/select.svelte',
        'components/select/select-trigger.svelte',
        'components/select/select-value.svelte',
        'components/select/select-content.svelte',
        'components/select/select-item.svelte',
        'components/select/select-label.svelte',
        'components/select/context.svelte.ts',
        'components/select/index.ts',
        'components/select/manifest.ts'
    ],
    components: ['popover', 'button', 'scroll-area'],
    shared: ['utils.cn', 'utils.createContext', 'utils.travelingHighlight'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

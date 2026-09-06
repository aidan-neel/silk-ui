import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Copy Button.
 *
 * 1.0.0 -- copies text to the clipboard with a Copy↔Check icon morph and a
 *          shared tooltip label update.
 * 1.1.0 -- accepts an optional children label rendered after the icon.
 *          Pair it with a text size; the icon default clips label text.
 */
export const manifest: Manifest = {
    name: 'copy-button',
    version: '1.1.0',
    visibility: 'public',
    description:
        'One-tap clipboard button with a Copy↔Check icon morph and tooltip feedback, reverting after a short hold.',
    files: [
        'components/copy-button/copy-button.svelte',
        'components/copy-button/index.ts',
        'components/copy-button/manifest.ts'
    ],
    components: ['button', 'tooltip'],
    shared: ['utils.cn'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

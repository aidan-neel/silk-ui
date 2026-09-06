import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Shared highlight.js grammars -- internal. Used by the code-block and
 * file-diff highlighters so snippets and diff rows highlight identically:
 * a Svelte template grammar plus an enhanced Python grammar (function-call
 * titles and operators on top of stock highlight.js).
 *
 * Internal visibility -- the CLI installs this as a transitive dependency
 * only. Consumers reach it through code-block or file-diff.
 *
 * Version history:
 *   1.0.0 -- initial release. Svelte grammar extracted from the code-block
 *           highlighter so file-diff rows highlight Svelte with the same
 *           grammar; Python wrapper adds call titles and operators.
 */
export const manifest: Manifest = {
    name: '_internal/highlight',
    version: '1.0.0',
    visibility: 'internal',
    description:
        'Shared highlight.js grammars (Svelte template, enhanced Python) consumed by the code-block and file-diff highlighters; not directly installable.',
    files: [
        'components/_internal/highlight/svelte.ts',
        'components/_internal/highlight/python.ts',
        'components/_internal/highlight/index.ts',
        'components/_internal/highlight/manifest.ts'
    ],
    components: [],
    shared: [],
    peerDependencies: {
        'highlight.js': '^11.0.0'
    }
};

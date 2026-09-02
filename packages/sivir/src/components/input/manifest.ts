import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

/**
 * Input.
 *
 * 1.0.0 -- initial.
 * 2.0.0: removed `bind:value` from the type="checkbox" branch (Svelte 5
 *        throws when both bind:value and bind:checked are present).
 *        Consumers using type="checkbox" must read state via
 *        bind:checked only.
 * 3.0.0: removed the `primary` variant (it duplicated the base field look).
 *        Default variant is now `outlined`.
 * 4.0.0: renamed variant `outlined` → `outline` to align with field taxonomy.
 *        Both variants now use the public semantic field and motion tokens.
 *        Default remains `outline`.
 * 5.0.0: added optional `leading` and `trailing` adornment snippets.
 */
export const manifest: Manifest = {
    name: 'input',
    version: '5.0.0',
    visibility: 'public',
    description:
        'Text input wrapping a native <input>. Supports labels, descriptions, adornments, 2 variants, and native input types.',
    files: [
        'components/input/input.svelte',
        'components/input/variants.ts',
        'components/input/index.ts',
        'components/input/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        'tailwind-merge': '^3.0.0',
        'tailwind-variants': '^3.0.0',
        svelte: '^5.0.0'
    }
};

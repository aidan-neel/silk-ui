import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'typography',
    version: '1.1.0',
    visibility: 'public',
    description:
        'Document headings, role-based text, inline code, and compact interface typography primitives.',
    files: [
        'components/typography/typography-title.svelte',
        'components/typography/typography-h1.svelte',
        'components/typography/typography-h2.svelte',
        'components/typography/typography-h3.svelte',
        'components/typography/typography-h4.svelte',
        'components/typography/typography-h5.svelte',
        'components/typography/typography-h6.svelte',
        'components/typography/typography-description.svelte',
        'components/typography/typography-metadata.svelte',
        'components/typography/typography-text.svelte',
        'components/typography/typography-inline-code.svelte',
        'components/typography/types.ts',
        'components/typography/variants.ts',
        'components/typography/index.ts',
        'components/typography/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    },
    tier: 'tier-1'
};

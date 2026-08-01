export const manifest = {
    name: 'accordion',
    version: '1.0.0',
    visibility: 'public',
    description: 'Vertically stacked disclosure panels. Single or multiple expanded items.',
    files: [
        'components/accordion/accordion.svelte',
        'components/accordion/accordion-item.svelte',
        'components/accordion/accordion-trigger.svelte',
        'components/accordion/accordion-content.svelte',
        'components/accordion/index.ts',
        'components/accordion/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn', 'transition'],
    peerDependencies: {
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

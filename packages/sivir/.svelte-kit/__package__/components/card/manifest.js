export const manifest = {
    name: 'card',
    version: '1.0.1',
    visibility: 'public',
    description: 'Surface container with Header, Title, Description, Content, and Footer subparts.',
    files: [
        'components/card/card.svelte',
        'components/card/card-header.svelte',
        'components/card/card-title.svelte',
        'components/card/card-description.svelte',
        'components/card/card-content.svelte',
        'components/card/card-footer.svelte',
        'components/card/index.ts',
        'components/card/manifest.ts'
    ],
    components: ['typography'],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

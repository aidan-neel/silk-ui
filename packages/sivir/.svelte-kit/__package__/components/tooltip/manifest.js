/**
 * Tooltip uses one shared floating surface per document, so every instance
 * avoids its own portal and positioning lifecycle. Trigger/Content preserve
 * the public composition API while Content supplies the accessible label.
 *
 * 2.1.0 -- in-place re-labels (e.g. Copy→Copied) roll via @scritto/core.
 */
export const manifest = {
    name: 'tooltip',
    version: '2.1.0',
    visibility: 'public',
    description: 'Hover-revealed inline guidance with a shared Tailwind-styled surface, role="tooltip", and small default delays.',
    role: 'tooltip',
    files: [
        'components/tooltip/tooltip.svelte',
        'components/tooltip/tooltip-content.svelte',
        'components/tooltip/tooltip-trigger.svelte',
        'components/tooltip/shared-tooltip.ts',
        'components/tooltip/index.ts',
        'components/tooltip/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        '@floating-ui/dom': '^1.0.0',
        '@scritto/core': '^0.1.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

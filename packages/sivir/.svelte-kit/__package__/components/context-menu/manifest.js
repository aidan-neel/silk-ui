export const manifest = {
    name: 'context-menu',
    version: '1.1.0',
    visibility: 'public',
    description:
        'Right-click contextual menu with sub-menus and checkbox items. Positioned via @floating-ui virtual element.',
    role: 'menu',
    files: [
        'components/context-menu/context-menu.svelte',
        'components/context-menu/context-menu-trigger.svelte',
        'components/context-menu/context-menu-content.svelte',
        'components/context-menu/context-menu-item.svelte',
        'components/context-menu/context-menu-checkbox-item.svelte',
        'components/context-menu/context-menu-separator.svelte',
        'components/context-menu/context-menu-sub.svelte',
        'components/context-menu/context-menu-sub-trigger.svelte',
        'components/context-menu/context-menu-sub-content.svelte',
        'components/context-menu/context.svelte.ts',
        'components/context-menu/index.ts',
        'components/context-menu/manifest.ts'
    ],
    components: ['popover', 'button'],
    shared: [
        'utils.closeMenuLayers',
        'utils.cn',
        'utils.createContext',
        'utils.travelingHighlight'
    ],
    peerDependencies: {
        '@floating-ui/dom': '^1.0.0',
        '@lucide/svelte': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

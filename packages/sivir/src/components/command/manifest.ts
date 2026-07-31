import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
	name: 'command',
	version: '1.0.0',
	visibility: 'public',
	description: 'Modal command palette with search, grouped items, and separators.',
	files: [
		'components/command/command.svelte',
		'components/command/command-trigger.svelte',
		'components/command/command-content.svelte',
		'components/command/command-results.svelte',
		'components/command/command-search.svelte',
		'components/command/search.ts',
		'components/command/command-item.svelte',
		'components/command/command-group.svelte',
		'components/command/command-separator.svelte',
		'components/command/context.svelte.ts',
		'components/command/index.ts',
		'components/command/manifest.ts'
	],
	components: ['modal', 'button'],
	shared: ['utils.cn', 'utils.createContext'],
	peerDependencies: {
		'@lucide/svelte': '^1.0.0',
		cnfast: '^0.0.8',
		'fuse.js': '^7.1.0',
		svelte: '^5.0.0'
	}
};

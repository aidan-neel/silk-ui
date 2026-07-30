import type { Manifest } from '@sivir/ui/_manifest/types';

export const manifest: Manifest = {
	name: 'checkbox',
	version: '1.0.0',
	visibility: 'public',
	description: 'Custom-styled checkbox with bindable checked. Default and primary variants.',
	files: [
		'components/checkbox/checkbox.svelte',
		'components/checkbox/variants.ts',
		'components/checkbox/index.ts',
		'components/checkbox/manifest.ts'
	],
	components: [],
	shared: ['utils.cn', 'transition'],
	peerDependencies: {
		'@lucide/svelte': '^1.0.0',
		cnfast: '^0.0.8',
		'tailwind-merge': '^3.0.0',
		'tailwind-variants': '^3.0.0',
		svelte: '^5.0.0'
	}
};

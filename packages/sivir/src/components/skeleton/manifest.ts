import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
	name: 'skeleton',
	version: '1.0.0',
	visibility: 'public',
	description: 'Animated loading placeholder.',
	files: [
		'components/skeleton/skeleton.svelte',
		'components/skeleton/index.ts',
		'components/skeleton/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		cnfast: '^0.0.8',
		svelte: '^5.0.0'
	}
};

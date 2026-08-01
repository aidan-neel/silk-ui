import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
	name: 'gauge',
	version: '1.0.0',
	visibility: 'public',
	description:
		'Compact circular meter for bounded quantities such as context remaining, usage limits, storage, and seats.',
	role: 'meter',
	files: [
		'components/gauge/gauge.svelte',
		'components/gauge/index.ts',
		'components/gauge/manifest.ts'
	],
	components: [],
	shared: ['utils.cn'],
	peerDependencies: {
		cnfast: '^0.0.8',
		svelte: '^5.0.0'
	}
};

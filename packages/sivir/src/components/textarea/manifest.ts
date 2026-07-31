import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
	name: 'textarea',
	version: '1.0.0',
	visibility: 'public',
	description: 'Multi-line text input wrapping native <textarea>. Shares variants with input.',
	files: [
		'components/textarea/textarea.svelte',
		'components/textarea/index.ts',
		'components/textarea/manifest.ts'
	],
	components: ['input'],
	shared: ['utils.cn'],
	peerDependencies: {
		cnfast: '^0.0.8',
		svelte: '^5.0.0'
	}
};

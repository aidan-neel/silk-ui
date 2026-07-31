import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
	name: 'markdown',
	version: '1.0.0',
	visibility: 'public',
	description:
		'Safe GFM markdown renderer for dense agent output, with token-based rendering and Sivir code blocks.',
	files: [
		'components/markdown/markdown.svelte',
		'components/markdown/markdown-token.svelte',
		'components/markdown/_types.ts',
		'components/markdown/index.ts',
		'components/markdown/manifest.ts'
	],
	components: ['code-block'],
	shared: ['utils.cn'],
	peerDependencies: {
		cnfast: '^0.0.8',
		marked: '^18.0.7',
		svelte: '^5.0.0',
		'tailwind-merge': '^3.0.0'
	}
};

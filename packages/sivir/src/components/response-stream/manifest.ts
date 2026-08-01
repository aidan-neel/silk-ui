import type { Manifest } from '@sivir-ui/svelte/_manifest/types';

export const manifest: Manifest = {
    name: 'response-stream',
    version: '1.0.0',
    visibility: 'public',
    description: 'Animated AI response text with typewriter and word-fade modes.',
    role: 'status',
    files: [
        'components/response-stream/response-stream.svelte',
        'components/response-stream/index.ts',
        'components/response-stream/manifest.ts'
    ],
    components: [],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0',
        'tailwind-merge': '^3.0.0'
    }
};

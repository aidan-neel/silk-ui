import adapterNode from '@sveltejs/adapter-node';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const deploymentAdapter = process.env.DOCS_ADAPTER === 'node' ? adapterNode() : adapter();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: deploymentAdapter,
		alias: {
			'@sivir-ui/svelte/brand-mark': '../../packages/sivir/src/brand-mark.svelte',
			'@sivir-ui/svelte': '../../packages/sivir/src',
			'@sivir-ui/svelte/*': '../../packages/sivir/src/*'
		}
	}
};

export default config;

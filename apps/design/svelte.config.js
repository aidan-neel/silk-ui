import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({ fallback: '200.html' }),
        alias: {
            '@sivir-ui/svelte/brand-mark': '../../packages/sivir/src/brand-mark.svelte',
            '@sivir-ui/svelte': '../../packages/sivir/src',
            '@sivir-ui/svelte/*': '../../packages/sivir/src/*'
        }
    }
};

export default config;

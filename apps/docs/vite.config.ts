import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';

function customHmr(): Plugin {
    return {
        name: 'custom-hmr',
        enforce: 'post' as const,
        handleHotUpdate({ file, server }: { file: string; server: ViteDevServer }) {
            if (file.endsWith('.css') || file.includes('.css?')) {
                server.ws.send({ type: 'full-reload' });
            }
        }
    };
}

export default defineConfig({
    plugins: [sveltekit(), tailwindcss(), customHmr()],
    ssr:
        process.env.DOCS_ADAPTER === 'node'
            ? {
                  // Keep the adapter-node image self-contained. These are the only
                  // production dependencies left external by the default server build.
                  noExternal: ['@floating-ui/dom', 'clsx', 'tailwind-variants']
              }
            : undefined,
    server: {
        host: '0.0.0.0'
    },
    preview: {
        host: '0.0.0.0'
    }
});

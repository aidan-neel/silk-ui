import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
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

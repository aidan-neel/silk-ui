import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    server: { host: '127.0.0.1', port: 5174 },
    preview: { host: '127.0.0.1', port: 5174 },
    test: {
        include: ['src/**/*.test.ts'],
        testTimeout: 15_000
    }
});

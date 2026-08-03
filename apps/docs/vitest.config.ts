import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [sveltekit(), tailwindcss()],
    test: {
        projects: [
            {
                extends: true,
                resolve: {
                    conditions: ['browser']
                },
                test: {
                    name: 'unit',
                    include: ['tests/unit/**/*.test.ts'],
                    exclude: [
                        'tests/unit/**/*.browser.test.ts',
                        'tests/unit/**/*.ssr.test.ts',
                        'tests/unit/sivir/ssr.test.ts'
                    ],
                    environment: 'jsdom',
                    setupFiles: ['tests/setup.ts']
                }
            },
            {
                extends: true,
                test: {
                    name: 'ssr',
                    include: ['tests/unit/sivir/ssr.test.ts', 'tests/unit/**/*.ssr.test.ts'],
                    environment: 'node'
                }
            },
            {
                extends: true,
                resolve: {
                    conditions: ['browser']
                },
                test: {
                    name: 'browser',
                    include: ['tests/unit/**/*.browser.test.ts'],
                    exclude: ['tests/unit/**/*.reduced.browser.test.ts'],
                    setupFiles: ['tests/browser.setup.ts'],
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        headless: true,
                        instances: [{ browser: 'chromium' }]
                    }
                }
            },
            {
                extends: true,
                resolve: {
                    conditions: ['browser']
                },
                test: {
                    name: 'browser-reduced',
                    include: ['tests/unit/**/*.reduced.browser.test.ts'],
                    setupFiles: ['tests/browser.setup.ts'],
                    browser: {
                        enabled: true,
                        provider: playwright({ contextOptions: { reducedMotion: 'reduce' } }),
                        headless: true,
                        instances: [{ browser: 'chromium' }]
                    }
                }
            }
        ]
    }
});

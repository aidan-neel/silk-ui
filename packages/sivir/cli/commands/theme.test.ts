import { afterEach, describe, expect, test } from 'bun:test';
import { DEFAULT_THEME } from '../../src/themes/theme';
import { resolveThemeCss } from './theme';

const originalFetch = globalThis.fetch;

afterEach(() => {
    globalThis.fetch = originalFetch;
});

describe('resolveThemeCss', () => {
    test('validates and renders a remote version-2 theme', async () => {
        globalThis.fetch = (() =>
            Promise.resolve(
                new Response(JSON.stringify({ ...DEFAULT_THEME, slug: 'ocean', brand: '#0066cc' }))
            )) as unknown as typeof fetch;

        const result = await resolveThemeCss('ocean', 'https://registry.example');
        expect(result.source).toBe('registry');
        expect(result.css).toContain('--color-primary: #0066cc');
    });

    test('rejects malformed and legacy remote payloads', async () => {
        globalThis.fetch = (() =>
            Promise.resolve(
                new Response(JSON.stringify({ slug: 'legacy-theme' }))
            )) as unknown as typeof fetch;

        expect(resolveThemeCss('legacy-theme', 'https://registry.example')).rejects.toThrow(
            /invalid v2 theme/
        );
    });
});

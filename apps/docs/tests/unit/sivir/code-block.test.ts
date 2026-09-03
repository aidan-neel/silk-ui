import { Root } from '@sivir-ui/svelte/components/code-block';
import { highlight } from '@sivir-ui/svelte/components/code-block/highlight';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('CodeBlock highlighting safety', () => {
    it('escapes markup for an unknown language', () => {
        const html = highlight('<script>alert("xss")</script> & text', 'unknown');

        expect(html).toContain('&lt;script&gt;');
        expect(html).toContain('&lt;/script&gt;');
        expect(html).toContain('&amp; text');
        expect(html).not.toContain('<script>');
    });

    it('keeps source tags escaped when syntax highlighting HTML', () => {
        const html = highlight('<img src=x onerror=alert(1)>', 'html');

        expect(html).not.toContain('<img');
        expect(html).toContain('&lt;');
        expect(html).toContain('&gt;');
    });
});

describe('CodeBlock tabbed roll fallback', () => {
    it('renders the active tab code as plain text without animation support', () => {
        render(Root, {
            props: {
                value: 'a',
                tabs: [
                    { label: 'A', lang: 'a', code: 'aaa' },
                    { label: 'B', lang: 'b', code: 'bbb' }
                ]
            }
        });

        const panel = screen.getByRole('tabpanel');
        expect(panel).toHaveTextContent('aaa');
        expect(panel.querySelector('scritto-text')).not.toBeInTheDocument();
    });
});

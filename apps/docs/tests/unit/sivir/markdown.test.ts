import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/svelte';
import { Markdown } from '@sivir-ui/svelte/components/markdown';

describe('Markdown', () => {
    it('renders representative GFM structures', () => {
        const content = [
            '# Release status',
            '',
            '| Check | Result |',
            '| --- | --- |',
            '| Build | Passing |',
            '',
            '- [x] Tests',
            '- [ ] Deploy',
            '',
            '```js',
            'const answer = 42;',
            '```'
        ].join('\n');
        const { container } = render(Markdown, { props: { content } });

        expect(
            screen.getByRole('heading', { level: 1, name: 'Release status' })
        ).toBeInTheDocument();
        const table = within(screen.getByRole('region', { name: 'Markdown table' })).getByRole(
            'table'
        );
        expect(within(table).getByRole('columnheader', { name: 'Check' })).toBeInTheDocument();
        expect(within(table).getByRole('cell', { name: 'Passing' })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Completed task' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Incomplete task' })).not.toBeChecked();
        expect(container.querySelector('[data-ui="code-block"] code')).toHaveTextContent(
            'const answer = 42;'
        );
    });

    it('renders javascript and data URLs as inert text', () => {
        const { container } = render(Markdown, {
            props: {
                content: '[Run script](javascript:alert(1)) and [open data](data:text/html,unsafe)'
            }
        });

        expect(screen.queryByRole('link', { name: 'Run script' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'open data' })).not.toBeInTheDocument();
        expect(container.querySelectorAll('[data-unsafe-url]')).toHaveLength(2);
    });

    it('shows raw HTML as source without inserting executable elements', () => {
        const content = [
            '<script>document.body.dataset.compromised = "true";</script>',
            '',
            '<button onclick="sendSecrets()">Approve access</button>'
        ].join('\n');
        const { container } = render(Markdown, { props: { content } });

        expect(container.querySelector('script')).not.toBeInTheDocument();
        expect(container.querySelector('button')).not.toBeInTheDocument();
        expect(container.textContent).toContain(
            '<button onclick="sendSecrets()">Approve access</button>'
        );
        expect(document.body).not.toHaveAttribute('data-compromised');
    });

    it('opens external links in a protected new tab', () => {
        render(Markdown, { props: { content: '[Sivir docs](https://example.com/docs)' } });
        const link = screen.getByRole('link', { name: 'Sivir docs' });

        expect(link).toHaveAttribute('href', 'https://example.com/docs');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not load remote or backslash-normalized images', () => {
        const { container } = render(Markdown, {
            props: {
                content:
                    '![remote](https://example.com/pixel.gif)\n\n![escaped](/\\evil.example/pixel.gif)'
            }
        });

        expect(container.querySelector('img')).not.toBeInTheDocument();
    });
});

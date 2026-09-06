import * as FileDiff from '@sivir-ui/svelte/components/file-diff';
import { highlight } from '@sivir-ui/svelte/components/file-diff/highlight';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FileDiffTopBarFixture from '../../fixtures/FileDiffTopBarFixture.svelte';

describe('FileDiff highlighting', () => {
    it('escapes markup for an unknown language', () => {
        const html = highlight('<script>alert("xss")</script>', 'unknown');

        expect(html).toContain('&lt;script&gt;');
        expect(html).not.toContain('<script>');
    });

    it('highlights Svelte rows with the shared grammar', () => {
        const html = highlight('<div class="x">{y}</div>', 'svelte');

        expect(html).toContain('hljs-name');
        expect(html).toContain('hljs-attr');
        expect(html).toContain('hljs-template-variable');
    });

    it('highlights bare import rows without script tags', () => {
        const html = highlight("import * as F from 'x';", 'svelte');

        expect(html).toContain('hljs-keyword');
        expect(html).toContain('hljs-string');
    });

    it('keeps highlighting TypeScript rows', () => {
        expect(highlight('const t = 1;', 'ts')).toContain('hljs-keyword');
    });

    it('scopes Python call names and operators like code-block', () => {
        const html = highlight('total = compute(items) + 1', 'python');

        expect(html).toContain('hljs-title function_');
        expect(html).toContain('hljs-operator');
    });

    it('highlights newly supported languages', () => {
        expect(highlight('FROM node:22', 'dockerfile')).toContain('hljs-keyword');
        expect(highlight('+ added', 'diff')).toContain('hljs-addition');
    });
});

describe('FileDiff composed top bar', () => {
    it('renders filename and counts by default', () => {
        render(FileDiff.Root, {
            props: {
                file: 'src/auth.ts',
                lang: 'ts',
                additions: 3,
                deletions: 1,
                diff: [{ type: 'context', content: 'x' }]
            }
        });

        expect(screen.getByText('src/auth.ts')).toBeInTheDocument();
        expect(screen.getByText('+3')).toBeInTheDocument();
        expect(screen.getByText('−1')).toBeInTheDocument();
    });

    it('lets consumers recompose filename, counts, and actions', () => {
        render(FileDiffTopBarFixture);

        expect(screen.getByText('custom.ts')).toBeInTheDocument();
        expect(screen.getByText('+9')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
        expect(screen.queryByText('src/auth.ts')).not.toBeInTheDocument();
    });

    it('hides zero sides of the counts', () => {
        render(FileDiff.PlusMinus, { props: { additions: 2, deletions: 0 } });

        expect(screen.getByText('+2')).toBeInTheDocument();
        expect(screen.queryByText('−0')).not.toBeInTheDocument();
    });
});

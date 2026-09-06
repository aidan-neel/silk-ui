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

    it('emits tag-name and operator classes for markup and SQL', () => {
        expect(highlight('<CodeBlock value="x" />', 'xml')).toContain('hljs-name');
        expect(highlight('SELECT a FROM t WHERE x > 1', 'sql')).toContain('hljs-operator');
    });
});

describe('CodeBlock Svelte grammar', () => {
    it('highlights markup with tag and attribute scopes', () => {
        const html = highlight('<Button variant="outline" disabled>{label}</Button>', 'svelte');

        expect(html).toContain('hljs-name');
        expect(html).toContain('hljs-attr');
        expect(html).toContain('hljs-template-variable');
        expect(html).not.toContain('<Button');
    });

    it('highlights script blocks as TypeScript', () => {
        const html = highlight('<script>let count: number = $state(0);</script>', 'svelte');

        expect(html).toContain('hljs-keyword');
        expect(html).toContain('hljs-number');
    });

    it('highlights control-flow and render tags with keyword scopes', () => {
        const html = highlight('{#if user}{name}{:else}none{/if} {@html raw}', 'svelte');

        expect(html).toContain('hljs-template-tag');
        expect(html).toContain('hljs-keyword');
    });

    it('keeps nested braces balanced', () => {
        const html = highlight('{update({ id, meta: { deep: true } })}', 'svelte');
        const opens = (html.match(/<span/g) ?? []).length;
        const closes = (html.match(/<\/span>/g) ?? []).length;

        expect(html).toContain('hljs-literal');
        expect(opens).toBe(closes);
    });

    it('keeps braces inside strings from splitting expressions', () => {
        const html = highlight(`{greet('{name}')}`, 'svelte');

        expect(html).toContain('hljs-string');
        expect(html).toContain('{name}');
    });

    it('highlights style blocks as CSS, not expressions', () => {
        const html = highlight('<style>strong { font-weight: 600; }</style>', 'svelte');

        expect(html).toContain('hljs-attribute');
        expect(html).not.toContain('hljs-template-variable');
    });

    it('keeps braces inside comments from opening expressions', () => {
        const html = highlight('<!-- {#if x} -->', 'svelte');

        expect(html).toContain('hljs-comment');
        expect(html).not.toContain('hljs-template-tag');
    });

    it('highlights bare top-level statements without script tags', () => {
        const imports = highlight("import * as F from 'x';", 'svelte');
        expect(imports).toContain('hljs-keyword');
        expect(imports).toContain('hljs-string');

        const state = highlight('let open = $state(false);', 'svelte');
        expect(state).toContain('hljs-keyword');
        expect(state).toContain('hljs-literal');
    });

    it('leaves prose starting with let-like words alone', () => {
        const html = highlight("<button>Let's go</button>", 'svelte');

        expect(html).toContain('hljs-name');
        expect(html).not.toContain('hljs-keyword');
    });

    it('highlights line comments at the top level', () => {
        const html = highlight('// fetch the thing', 'svelte');

        expect(html).toContain('hljs-comment');
    });
});

describe('CodeBlock broad language support', () => {
    it('scopes Python call names and operators', () => {
        const html = highlight('pc = Pinecone(api_key="X")\ntotal = len(items) + 1', 'python');

        expect(html).toContain('hljs-title function_');
        expect(html).toContain('hljs-operator');
        expect(html).toContain('hljs-string');
    });

    it('emits addition and deletion scopes for diffs', () => {
        const html = highlight('+ added\n- removed\n context', 'diff');

        expect(html).toContain('hljs-addition');
        expect(html).toContain('hljs-deletion');
    });

    it('highlights Docker, Swift, PowerShell, and GraphQL keywords', () => {
        expect(highlight('FROM node:22', 'dockerfile')).toContain('hljs-keyword');
        expect(highlight('func greet(name: String)', 'swift')).toContain('hljs-title function_');
        expect(highlight('Write-Host "hi"', 'powershell')).toContain('hljs-built_in');
        expect(highlight('query GetUser {', 'graphql')).toContain('hljs-keyword');
    });

    it('colorizes package-manager one-liners', () => {
        const html = highlight('bunx @sivir-ui/svelte add code-block', 'bash');

        expect(html).toContain('hljs-built_in');
        expect(html).toContain('hljs-keyword');
        expect(html).toContain('hljs-string');
    });
});

describe('CodeBlock theme', () => {
    it('paints the built-in token variables by default', () => {
        const { container } = render(Root, {
            props: {
                code: 'const value = 1;',
                lang: 'ts'
            }
        });

        const root = container.querySelector('[data-ui="code-block"]');
        expect(root?.className).toContain('code-block-token-keyword');
        expect(root?.className).toContain('code-block-token-entity');
    });

    it('omits the built-in token variables with theme="custom"', () => {
        const { container } = render(Root, {
            props: {
                code: 'const value = 1;',
                lang: 'ts',
                theme: 'custom'
            }
        });

        const root = container.querySelector('[data-ui="code-block"]');
        expect(root?.className).not.toContain('code-block-token-');
    });
});

describe('CodeBlock tabbed panel', () => {
    it('renders the active tab code highlighted without a roller', () => {
        render(Root, {
            props: {
                value: 'typescript',
                tabs: [
                    { label: 'TS', lang: 'typescript', code: 'const value = 1;' },
                    { label: 'PY', lang: 'python', code: 'value = 1' }
                ]
            }
        });

        const panels = screen.getAllByRole('tabpanel');
        const active = panels.find((panel) => panel.getAttribute('data-state') === 'active');
        expect(active).toHaveTextContent('const value = 1;');
        expect(active?.querySelector('scritto-text')).not.toBeInTheDocument();
        expect(active?.innerHTML).toContain('hljs-keyword');
    });
});

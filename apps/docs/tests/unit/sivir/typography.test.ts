import Description from '@sivir-ui/svelte/components/typography/typography-description.svelte';
import H1 from '@sivir-ui/svelte/components/typography/typography-h1.svelte';
import H2 from '@sivir-ui/svelte/components/typography/typography-h2.svelte';
import H3 from '@sivir-ui/svelte/components/typography/typography-h3.svelte';
import H4 from '@sivir-ui/svelte/components/typography/typography-h4.svelte';
import H5 from '@sivir-ui/svelte/components/typography/typography-h5.svelte';
import H6 from '@sivir-ui/svelte/components/typography/typography-h6.svelte';
import InlineCode from '@sivir-ui/svelte/components/typography/typography-inline-code.svelte';
import Metadata from '@sivir-ui/svelte/components/typography/typography-metadata.svelte';
import Text from '@sivir-ui/svelte/components/typography/typography-text.svelte';
import Title from '@sivir-ui/svelte/components/typography/typography-title.svelte';
import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => text
    }));
}

describe('Typography', () => {
    it.each([
        { component: H1, level: 1 },
        { component: H2, level: 2 },
        { component: H3, level: 3 },
        { component: H4, level: 4 },
        { component: H5, level: 5 },
        { component: H6, level: 6 }
    ] as const)('renders H$level as a level $level heading', ({ component, level }) => {
        render(component, {
            props: {
                children: textSnippet(`Heading ${level}`)
            }
        });

        const heading = screen.getByRole('heading', {
            level,
            name: `Heading ${level}`
        });
        expect(heading).toHaveAttribute('data-ui', `typography-h${level}`);
    });

    it.each([1, 2, 3, 4, 5, 6] as const)('renders title level %s', (level) => {
        render(Title, {
            props: {
                level,
                children: textSnippet(`Level ${level}`)
            }
        });

        const heading = screen.getByRole('heading', {
            level,
            name: `Level ${level}`
        });
        expect(heading).toHaveAttribute('data-ui', 'typography-title');
    });

    it('renders descriptions as paragraphs', () => {
        render(Description, {
            props: {
                children: textSnippet('Supporting information')
            }
        });

        const description = screen.getByText('Supporting information');
        expect(description.tagName).toBe('P');
        expect(description).toHaveAttribute('data-ui', 'typography-description');
    });

    it('renders metadata as inline text', () => {
        render(Metadata, {
            props: {
                children: textSnippet('Updated recently')
            }
        });

        const metadata = screen.getByText('Updated recently');
        expect(metadata.tagName).toBe('SPAN');
        expect(metadata).toHaveAttribute('data-ui', 'typography-metadata');
    });

    it.each(['lead', 'body', 'supporting'] as const)('renders the %s text role', (variant) => {
        render(Text, {
            props: {
                variant,
                children: textSnippet(`${variant} text`)
            }
        });

        const text = screen.getByText(`${variant} text`);
        expect(text.tagName).toBe('P');
        expect(text).toHaveAttribute('data-ui', 'typography-text');
        expect(text).toHaveAttribute('data-variant', variant);
    });

    it('renders inline code with native attributes', () => {
        render(InlineCode, {
            props: {
                title: 'Config path',
                children: textSnippet('sivir.config.json')
            }
        });

        const code = screen.getByText('sivir.config.json');
        expect(code.tagName).toBe('CODE');
        expect(code).toHaveAttribute('title', 'Config path');
        expect(code).toHaveAttribute('data-ui', 'typography-inline-code');
    });

    it('forwards native attributes and consumer classes', () => {
        render(Title, {
            props: {
                level: 2,
                id: 'account-title',
                class: 'custom-title font-serif text-xl font-bold tracking-wide',
                'aria-label': 'Account',
                children: textSnippet('Account')
            }
        });

        const title = screen.getByRole('heading', { level: 2, name: 'Account' });
        expect(title).toHaveAttribute('id', 'account-title');
        expect(title).toHaveClass('custom-title');
        expect(title).toHaveClass('font-serif', 'text-xl', 'font-bold', 'tracking-wide');
        expect(title.className).not.toContain('var(--font-header)');
        expect(title.className).not.toContain('var(--font-size-header');
        expect(title.className).not.toContain('var(--font-weight-header');
        expect(title.className).not.toContain('var(--tracking-header');
    });
});

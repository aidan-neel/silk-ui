import ScrollArea from '@sivir-ui/svelte/components/scroll-area/scroll-area.svelte';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import { queryRequired } from '../../test-utils';

/*
 * Scroll-area is a pure presentational wrapper -- it sets overflow rules
 * via Tailwind classes based on the `orientation` prop and applies a
 * themed scrollbar via Tailwind arbitrary variants. No JS-driven scrollbar behavior.
 * jsdom is appropriate; no browser-runner justification under Sec.7.1.
 */

function textSnippet(text: string) {
    return createRawSnippet(() => ({ render: () => `<div>${text}</div>` }));
}

describe('ScrollArea -- rendering', () => {
    it('renders the root with data-ui="scroll-area"', () => {
        const { container } = render(ScrollArea, {
            props: { children: textSnippet('content') }
        });
        expect(container.querySelector('[data-ui="scroll-area"]')).toBeInTheDocument();
    });

    it('renders snippet children', () => {
        const { container } = render(ScrollArea, {
            props: { children: textSnippet('inside scroll') }
        });
        expect(container.textContent).toContain('inside scroll');
    });

    it('uses Tailwind scrollbar utilities on the viewport without a custom class', () => {
        const { container } = render(ScrollArea, {
            props: { children: textSnippet('x') }
        });
        const viewport = queryRequired(container, '[data-ui="scroll-area-viewport"]');
        expect(viewport.className).toContain('[scrollbar-width:thin]');
        expect(viewport.className).toContain('[&::-webkit-scrollbar]:size-2.5');
        expect(viewport.className).not.toContain('sivir-scroll');
    });
});

describe('ScrollArea -- orientation prop', () => {
    it('defaults to vertical and applies overflow-y-auto', () => {
        const { container } = render(ScrollArea, {
            props: { children: textSnippet('x') }
        });
        const root = queryRequired(container, '[data-ui="scroll-area"]');
        const viewport = queryRequired(container, '[data-ui="scroll-area-viewport"]');
        expect(root.getAttribute('data-orientation')).toBe('vertical');
        expect(viewport.className).toContain('overflow-y-auto');
        expect(viewport.className).toContain('overflow-x-hidden');
    });

    it('applies overflow-x-auto for orientation="horizontal"', () => {
        const { container } = render(ScrollArea, {
            props: { orientation: 'horizontal', children: textSnippet('x') }
        });
        const root = queryRequired(container, '[data-ui="scroll-area"]');
        const viewport = queryRequired(container, '[data-ui="scroll-area-viewport"]');
        expect(root.getAttribute('data-orientation')).toBe('horizontal');
        expect(viewport.className).toContain('overflow-x-auto');
        expect(viewport.className).toContain('overflow-y-hidden');
    });

    it('exposes data-orientation as a styling hook for downstream CSS', () => {
        const { container: vert } = render(ScrollArea, {
            props: { orientation: 'vertical', children: textSnippet('x') }
        });
        const { container: horiz } = render(ScrollArea, {
            props: { orientation: 'horizontal', children: textSnippet('x') }
        });
        expect(
            vert.querySelector('[data-ui="scroll-area"]')?.getAttribute('data-orientation')
        ).toBe('vertical');
        expect(
            horiz.querySelector('[data-ui="scroll-area"]')?.getAttribute('data-orientation')
        ).toBe('horizontal');
    });
});

describe('ScrollArea -- overscroll behavior', () => {
    it('applies overscroll-contain to prevent scroll chaining', () => {
        const { container } = render(ScrollArea, {
            props: { children: textSnippet('x') }
        });
        const viewport = queryRequired(container, '[data-ui="scroll-area-viewport"]');
        expect(viewport.className).toContain('overscroll-contain');
    });

    it('does not pad the scrollport so edge fades sit flush', () => {
        const { container } = render(ScrollArea, {
            props: { children: textSnippet('x') }
        });
        const viewport = queryRequired(container, '[data-ui="scroll-area-viewport"]');
        expect(viewport.className.split(/\s+/)).not.toContain('p-1');
    });
});

describe('ScrollArea -- edge cues', () => {
    it('clips blurred cues within the root shell and overlaps the viewport edges', async () => {
        const { container } = render(ScrollArea, {
            props: { children: textSnippet('x') }
        });
        const root = queryRequired<HTMLElement>(container, '[data-ui="scroll-area"]');
        const viewport = queryRequired<HTMLElement>(container, '[data-ui="scroll-area-viewport"]');

        Object.defineProperties(viewport, {
            scrollHeight: { configurable: true, value: 1000 },
            clientHeight: { configurable: true, value: 200 }
        });
        viewport.scrollTop = 100;
        await fireEvent.scroll(viewport);

        await waitFor(() => {
            expect(viewport.querySelectorAll('[aria-hidden="true"] > div')).toHaveLength(2);
        });

        const [topCue, bottomCue] = Array.from(
            viewport.querySelectorAll<HTMLElement>('[aria-hidden="true"] > div')
        );

        expect(root.className).toContain('overflow-hidden');
        expect(viewport.className).toContain('rounded-[inherit]');
        expect(topCue.className).toContain('backdrop-blur-sm');
        expect(topCue.className).toContain('-top-px');
        expect(topCue.className).toContain(
            '[mask-image:linear-gradient(to_bottom,#000_0%,#000_40%,transparent_100%)]'
        );
        expect(bottomCue.className).toContain('backdrop-blur-sm');
        expect(bottomCue.className).toContain('-bottom-px');
        expect(bottomCue.className).toContain(
            '[mask-image:linear-gradient(to_top,#000_0%,#000_40%,transparent_100%)]'
        );
    });
});

describe('ScrollArea -- attribute spreading', () => {
    it('forwards class to the root', () => {
        const { container } = render(ScrollArea, {
            props: { class: 'my-scroll', children: textSnippet('x') } as never
        });
        const root = queryRequired(container, '[data-ui="scroll-area"]');
        expect(root.className).toContain('my-scroll');
    });

    it('spreads aria-label to the scrollable viewport', () => {
        const { container } = render(ScrollArea, {
            props: { 'aria-label': 'Article body', children: textSnippet('x') } as never
        });
        const viewport = queryRequired(container, '[data-ui="scroll-area-viewport"]');
        expect(viewport.getAttribute('aria-label')).toBe('Article body');
    });
});

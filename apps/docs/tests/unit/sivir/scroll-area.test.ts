import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import ScrollArea from '@sivir-ui/svelte/components/scroll-area/scroll-area.svelte';

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

	it('uses Tailwind scrollbar utilities without a custom class', () => {
		const { container } = render(ScrollArea, {
			props: { children: textSnippet('x') }
		});
		const root = container.querySelector('[data-ui="scroll-area"]')!;
		expect(root.className).toContain('[scrollbar-width:thin]');
		expect(root.className).toContain('[&::-webkit-scrollbar]:size-2.5');
		expect(root.className).not.toContain('sivir-scroll');
	});
});

describe('ScrollArea -- orientation prop', () => {
	it('defaults to vertical and applies overflow-y-auto', () => {
		const { container } = render(ScrollArea, {
			props: { children: textSnippet('x') }
		});
		const root = container.querySelector('[data-ui="scroll-area"]')!;
		expect(root.getAttribute('data-orientation')).toBe('vertical');
		expect(root.className).toContain('overflow-y-auto');
		expect(root.className).toContain('overflow-x-hidden');
	});

	it('applies overflow-x-auto for orientation="horizontal"', () => {
		const { container } = render(ScrollArea, {
			props: { orientation: 'horizontal', children: textSnippet('x') }
		});
		const root = container.querySelector('[data-ui="scroll-area"]')!;
		expect(root.getAttribute('data-orientation')).toBe('horizontal');
		expect(root.className).toContain('overflow-x-auto');
		expect(root.className).toContain('overflow-y-hidden');
	});

	it('exposes data-orientation as a styling hook for downstream CSS', () => {
		const { container: vert } = render(ScrollArea, {
			props: { orientation: 'vertical', children: textSnippet('x') }
		});
		const { container: horiz } = render(ScrollArea, {
			props: { orientation: 'horizontal', children: textSnippet('x') }
		});
		expect(vert.querySelector('[data-ui="scroll-area"]')?.getAttribute('data-orientation')).toBe(
			'vertical'
		);
		expect(horiz.querySelector('[data-ui="scroll-area"]')?.getAttribute('data-orientation')).toBe(
			'horizontal'
		);
	});
});

describe('ScrollArea -- overscroll behavior', () => {
	it('applies overscroll-contain to prevent scroll chaining', () => {
		const { container } = render(ScrollArea, {
			props: { children: textSnippet('x') }
		});
		const root = container.querySelector('[data-ui="scroll-area"]')!;
		expect(root.className).toContain('overscroll-contain');
	});

	it('does not pad the scrollport so edge fades sit flush', () => {
		const { container } = render(ScrollArea, {
			props: { children: textSnippet('x') }
		});
		const root = container.querySelector('[data-ui="scroll-area"]')!;
		expect(root.className.split(/\s+/)).not.toContain('p-1');
	});
});

describe('ScrollArea -- attribute spreading', () => {
	it('forwards class to the root', () => {
		const { container } = render(ScrollArea, {
			props: { class: 'my-scroll', children: textSnippet('x') } as never
		});
		const root = container.querySelector('[data-ui="scroll-area"]')!;
		expect(root.className).toContain('my-scroll');
	});

	it('spreads aria-label', () => {
		const { container } = render(ScrollArea, {
			props: { 'aria-label': 'Article body', children: textSnippet('x') } as never
		});
		const root = container.querySelector('[data-ui="scroll-area"]')!;
		expect(root.getAttribute('aria-label')).toBe('Article body');
	});
});

import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import TabsFixture from '../../fixtures/TabsFixture.svelte';

async function settleLayout() {
    await tick();
    await tick();
    await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
}

function getHighlight(list: Element) {
    const highlight = list.querySelector<HTMLElement>('div[aria-hidden="true"]');
    if (!highlight) {
        throw new Error('Expected Tabs to render a highlight');
    }
    return highlight;
}

async function expectMatchingBounds(highlight: Element, target: Element) {
    await vi.waitFor(
        () => {
            const highlightBounds = highlight.getBoundingClientRect();
            const targetBounds = target.getBoundingClientRect();
            expect(highlightBounds.top).toBeCloseTo(targetBounds.top, 0);
            expect(highlightBounds.left).toBeCloseTo(targetBounds.left, 0);
            expect(highlightBounds.width).toBeCloseTo(targetBounds.width, 0);
            expect(highlightBounds.height).toBeCloseTo(targetBounds.height, 0);
        },
        {
            interval: 16,
            timeout: 1_000
        }
    );
}

afterEach(() => {
    document.documentElement.removeAttribute('dir');
});

describe('Tabs -- vertical layout', () => {
    it('stacks tabs, places content beside them, and moves the ghost highlight', async () => {
        render(TabsFixture, {
            value: 'one',
            orientation: 'vertical',
            variant: 'ghost'
        });
        await settleLayout();

        const list = page.getByRole('tablist').element();
        const panel = page.getByRole('tabpanel').element();
        const first = page.getByRole('tab', { name: 'One' }).element();
        const second = page.getByRole('tab', { name: 'Two' });
        const firstBounds = first.getBoundingClientRect();
        const secondBounds = second.element().getBoundingClientRect();
        expect(secondBounds.top).toBeGreaterThanOrEqual(firstBounds.bottom);
        expect(panel.getBoundingClientRect().left).toBeGreaterThan(
            list.getBoundingClientRect().right
        );

        const highlight = getHighlight(list);
        await expectMatchingBounds(highlight, first);
        await second.hover();
        await expectMatchingBounds(highlight, second.element());
    });

    it('remeasures the focused ghost tab after a runtime orientation change', async () => {
        const view = render(TabsFixture, {
            value: 'one',
            orientation: 'horizontal',
            variant: 'ghost'
        });
        await settleLayout();

        const list = page.getByRole('tablist').element();
        const first = page.getByRole('tab', { name: 'One' }).element();
        const second = page.getByRole('tab', { name: 'Two' });
        const highlight = getHighlight(list);
        second.element().focus();
        await settleLayout();
        await expectMatchingBounds(highlight, second.element());
        expect(second.element().getBoundingClientRect().left).toBeGreaterThan(
            first.getBoundingClientRect().right
        );

        await view.rerender({
            value: 'one',
            orientation: 'vertical',
            variant: 'ghost'
        });
        await settleLayout();

        expect(second.element().getBoundingClientRect().top).toBeGreaterThanOrEqual(
            first.getBoundingClientRect().bottom
        );
        await expectMatchingBounds(highlight, second.element());
    });

    it('keeps the default active line between the tablist and content in RTL', async () => {
        document.documentElement.dir = 'rtl';
        render(TabsFixture, {
            value: 'one',
            orientation: 'vertical',
            variant: 'default'
        });
        await settleLayout();

        const list = page.getByRole('tablist').element();
        const panel = page.getByRole('tabpanel').element();
        const activeTab = page.getByRole('tab', { name: 'One' }).element();
        const line = getHighlight(list);
        const listBounds = list.getBoundingClientRect();
        const panelBounds = panel.getBoundingClientRect();
        const tabBounds = activeTab.getBoundingClientRect();
        const lineBounds = line.getBoundingClientRect();

        expect(panelBounds.right).toBeLessThan(listBounds.left);
        expect(lineBounds.left).toBeCloseTo(listBounds.left, 0);
        expect(lineBounds.top).toBeCloseTo(tabBounds.top, 0);
        expect(lineBounds.height).toBeCloseTo(tabBounds.height, 0);
    });
});

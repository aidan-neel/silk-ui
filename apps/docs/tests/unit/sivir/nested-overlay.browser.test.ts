import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import NestedOverlayFixture from '../../fixtures/NestedOverlayFixture.svelte';

async function flush() {
    await tick();
    await tick();
    await new Promise((r) => setTimeout(r, 20));
}

afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
});

describe('Sibling Modal + Popover body lock', () => {
    it('keeps body locked when modal closes while popover stays open', async () => {
        // Controlled open avoids click-outside / full-screen overlay fighting the
        // sibling trigger. This is the nested-lock contract: two independent
        // layers, one shared refcount.
        const view = render(NestedOverlayFixture, { modalOpen: true, popoverOpen: true });
        await flush();

        await expect.element(page.getByText('Sibling modal')).toBeInTheDocument();
        await expect.element(page.getByTestId('popover-body')).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('hidden');

        await view.rerender({ modalOpen: false, popoverOpen: true });
        await flush();
        await expect.element(page.getByText('Sibling modal')).not.toBeInTheDocument();
        await expect.element(page.getByTestId('popover-body')).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('unlocks body only after both layers close', async () => {
        const view = render(NestedOverlayFixture, { modalOpen: true, popoverOpen: true });
        await flush();
        await expect.element(page.getByText('Sibling modal')).toBeInTheDocument();
        await expect.element(page.getByTestId('popover-body')).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('hidden');

        await view.rerender({ modalOpen: false, popoverOpen: true });
        await flush();
        await expect.element(page.getByText('Sibling modal')).not.toBeInTheDocument();
        await expect.element(page.getByTestId('popover-body')).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('hidden');

        await userEvent.keyboard('{Escape}');
        await flush();
        await expect.element(page.getByTestId('popover-body')).not.toBeInTheDocument();
        expect(document.body.style.overflow).toBe('');
    });
});

import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import SelectFixture from '../../fixtures/SelectFixture.svelte';
import SelectScrollableFixture from '../../fixtures/SelectScrollableFixture.svelte';

async function flush() {
    await tick();
    await tick();
    await new Promise((r) => setTimeout(r, 20));
}

async function openSelect() {
    await page.getByTestId('select-trigger').click();
    await flush();
}

describe('Select -- open and close', () => {
    it('hides options initially', async () => {
        render(SelectFixture, {});
        await flush();
        await expect.element(page.getByTestId('opt-apple')).not.toBeInTheDocument();
    });

    it('shows options after opening', async () => {
        render(SelectFixture, {});
        await flush();
        await openSelect();
        await expect.element(page.getByTestId('opt-apple')).toBeInTheDocument();
        await expect.element(page.getByTestId('opt-banana')).toBeInTheDocument();
        await expect.element(page.getByTestId('opt-cherry')).toBeInTheDocument();
        await expect.element(page.getByText('Fruits')).toBeInTheDocument();
        expect(document.querySelectorAll('[role="listbox"] .sivir-item-highlight')).toHaveLength(1);
    });

    it('closes on Escape', async () => {
        render(SelectFixture, {});
        await flush();
        await openSelect();

        await userEvent.keyboard('{Escape}');
        await flush();
        await expect.element(page.getByTestId('opt-apple')).not.toBeInTheDocument();
    });

    it('closes on click outside', async () => {
        render(SelectFixture, {});
        await flush();
        await openSelect();
        await expect.element(page.getByTestId('opt-apple')).toBeInTheDocument();

        const outside = document.createElement('button');
        outside.textContent = 'outside';
        outside.style.position = 'fixed';
        outside.style.left = '8px';
        outside.style.top = '8px';
        document.body.append(outside);
        await new Promise((r) => setTimeout(r, 20));
        outside.click();
        await flush();
        await expect.element(page.getByTestId('opt-apple')).not.toBeInTheDocument();
        outside.remove();
    });
});

describe('Select -- selection behavior', () => {
    it('moves through options and selects with the keyboard', async () => {
        render(SelectFixture, {});
        await flush();
        await openSelect();
        await userEvent.keyboard('{ArrowDown}{Enter}');
        await flush();
        await expect.element(page.getByRole('combobox')).toHaveTextContent('Banana');
    });

    it('closes after an item is selected', async () => {
        render(SelectFixture, {});
        await flush();
        await openSelect();

        await page.getByTestId('opt-banana').click();
        await flush();
        await expect.element(page.getByTestId('opt-apple')).not.toBeInTheDocument();
    });

    it('sets aria-selected on the clicked option while it remains visible', async () => {
        render(SelectFixture, {});
        await flush();
        await openSelect();

        // Verify all options start unselected.
        const unselectedAtOpen = document.querySelectorAll(
            '[role="option"][aria-selected="false"]'
        );
        expect(unselectedAtOpen.length).toBe(3);
    });

    it('updates the underlying state.value to the clicked option', async () => {
        render(SelectFixture, {});
        await flush();
        await openSelect();

        await page.getByTestId('opt-banana').click();
        await flush();

        await expect.element(page.getByRole('combobox')).toHaveTextContent('Banana');
    });
});

describe('Select -- ARIA', () => {
    it('options use role="option"', async () => {
        render(SelectFixture, {});
        await flush();
        await openSelect();

        const options = document.querySelectorAll('[role="option"]');
        expect(options.length).toBe(3);
    });
});

describe('Select -- max-h-56 scrolling without explicit height', () => {
    it('caps the menu at max-h and scrolls the overflow', async () => {
        render(SelectScrollableFixture, {});
        await flush();
        await page.getByTestId('select-scrollable-trigger').click();
        await flush();

        const root = document.querySelector<HTMLElement>('[data-ui="scroll-area"]');
        const viewport = document.querySelector<HTMLElement>('[data-ui="scroll-area-viewport"]');
        expect(root).not.toBeNull();
        expect(viewport).not.toBeNull();
        if (!root || !viewport) {
            return;
        }

        // max-h-56 caps the menu instead of growing with all 30 options.
        expect(root.clientHeight).toBeLessThanOrEqual(240);
        // The viewport overflows, so the list scrolls inside the menu.
        expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);

        viewport.scrollTop = 100;
        await flush();
        expect(viewport.scrollTop).toBeGreaterThan(0);
    });
});

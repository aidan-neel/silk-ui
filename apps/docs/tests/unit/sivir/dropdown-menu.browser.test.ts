import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import DropdownMenuFixture from '../../fixtures/DropdownMenuFixture.svelte';

/*
 * Browser-runner justified per strategy Sec.7.1: popover-based open/close,
 * click-outside, real keyboard event propagation, focus management.
 */

async function flush() {
    await tick();
    await tick();
    await new Promise((r) => setTimeout(r, 20));
}

async function openMenu() {
    await page.getByTestId('dropdown-trigger').click();
    await flush();
}

describe('DropdownMenu -- open and close', () => {
    it('does not show content initially', async () => {
        render(DropdownMenuFixture, {});
        await flush();
        await expect.element(page.getByTestId('item-1')).not.toBeInTheDocument();
    });

    it('shows content after trigger click', async () => {
        render(DropdownMenuFixture, {});
        await flush();
        await openMenu();
        await expect.element(page.getByTestId('item-1')).toBeInTheDocument();
        await expect.element(page.getByTestId('item-2')).toBeInTheDocument();
        await expect.element(page.getByTestId('item-3')).toBeInTheDocument();
        expect(document.querySelectorAll('[role="menu"] .sivir-item-highlight')).toHaveLength(1);
    });

    it('closes on Escape', async () => {
        render(DropdownMenuFixture, {});
        await flush();
        await openMenu();

        await userEvent.keyboard('{Escape}');
        await flush();
        await expect.element(page.getByTestId('item-1')).not.toBeInTheDocument();
    });

    it('closes on click outside', async () => {
        render(DropdownMenuFixture, {});
        await flush();
        await openMenu();
        await expect.element(page.getByTestId('item-1')).toBeInTheDocument();

        const outside = document.createElement('button');
        outside.textContent = 'outside';
        outside.style.position = 'fixed';
        outside.style.left = '8px';
        outside.style.top = '8px';
        document.body.append(outside);
        await new Promise((r) => setTimeout(r, 20));
        outside.click();
        await flush();
        await expect.element(page.getByTestId('item-1')).not.toBeInTheDocument();
        outside.remove();
    });

    it('shows the group label', async () => {
        render(DropdownMenuFixture, {});
        await flush();
        await openMenu();
        await expect.element(page.getByText('Group label')).toBeInTheDocument();
    });
});

describe('DropdownMenu -- inverted', () => {
    function menuClass() {
        return (page.getByRole('menu').element() as HTMLElement).className;
    }

    it('overrides the surface fill var (--color-panel) when inverted', async () => {
        render(DropdownMenuFixture, { inverted: true });
        await flush();
        await openMenu();

        await expect.element(page.getByRole('menu')).toBeInTheDocument();
        expect(menuClass()).toContain('[--color-panel:hsl(0_0%_13%)]');
    });

    it('does not apply the inverted override by default', async () => {
        render(DropdownMenuFixture, {});
        await flush();
        await openMenu();

        await expect.element(page.getByRole('menu')).toBeInTheDocument();
        expect(menuClass()).not.toContain('[--color-panel:hsl(0_0%_13%)]');
    });
});

describe('DropdownMenu -- item activation', () => {
    it('fires the item callback on click', async () => {
        const onItem1 = vi.fn();
        render(DropdownMenuFixture, { onItem1 });
        await flush();
        await openMenu();

        await page.getByTestId('item-1').click();
        await flush();
        expect(onItem1).toHaveBeenCalledTimes(1);
    });

    it('fires different callbacks for different items', async () => {
        const onItem1 = vi.fn();
        const onItem2 = vi.fn();
        const onItem3 = vi.fn();
        render(DropdownMenuFixture, { onItem1, onItem2, onItem3 });
        await flush();
        await openMenu();

        await page.getByTestId('item-2').click();
        await flush();
        expect(onItem2).toHaveBeenCalledTimes(1);
        expect(onItem1).not.toHaveBeenCalled();
        expect(onItem3).not.toHaveBeenCalled();
    });
});

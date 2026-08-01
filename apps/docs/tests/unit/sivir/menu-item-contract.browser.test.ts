import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { tick } from 'svelte';
import MenuItemContractFixture from '../../fixtures/MenuItemContractFixture.svelte';

/*
 * Browser-runner justified per strategy Sec.7.1: this asserts resolved cascade
 * behaviour, which only a real engine computes.
 *
 * `.sivir-menu-item` lives in `@layer components`, and Tailwind declares
 * `@layer theme, base, components, utilities`. So the contract must beat the
 * plain element defaults while still losing to a consumer's own utilities --
 * that ordering is the whole reason menu rows render on an `unstyled` Button.
 */

async function flush() {
    await tick();
    await tick();
    await new Promise((r) => setTimeout(r, 20));
}

async function openMenu() {
    await page.getByTestId('contract-trigger').click();
    await flush();
}

function rowFor(testId: string) {
    const label = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
    const row = label?.closest<HTMLElement>('.sivir-menu-item');
    if (!row) throw new Error(`no .sivir-menu-item ancestor for ${testId}`);
    return row;
}

describe('menu-item stylesheet contract', () => {
    it('applies the contract from ui.css rather than the button variant base', async () => {
        render(MenuItemContractFixture, {});
        await flush();
        await openMenu();

        const style = getComputedStyle(rowFor('plain-item'));
        expect(style.display).toBe('flex');
        expect(style.justifyContent).toBe('space-between');
        expect(style.textAlign).toBe('left');
        expect(style.height).toBe('32px');
    });

    it('lets a consumer utility class win over the contract', async () => {
        render(MenuItemContractFixture, { overrideClass: 'h-16 justify-start' });
        await flush();
        await openMenu();

        const plain = getComputedStyle(rowFor('plain-item'));
        const overridden = getComputedStyle(rowFor('override-item'));

        expect(plain.height).toBe('32px');
        expect(overridden.height).toBe('64px');
        expect(overridden.justifyContent).toBe('flex-start');
    });
});

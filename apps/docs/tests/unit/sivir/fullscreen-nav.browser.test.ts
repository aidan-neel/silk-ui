import { afterEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { tick } from 'svelte';
import FullscreenNavFixture from '../../fixtures/FullscreenNavFixture.svelte';

async function flush() {
    await tick();
    await tick();
}

async function waitForClose() {
    await flush();
    await new Promise((resolve) => setTimeout(resolve, 200));
    await flush();
}

afterEach(() => {
    document.body.style.overflow = '';
});

describe('FullscreenNav', () => {
    it('keeps its portal host mounted while closed', async () => {
        render(FullscreenNavFixture, { open: false });
        await flush();

        expect(document.querySelector('[data-ui="fullscreen-nav-portal"]')).toBeInTheDocument();
    });

    it('opens from its trigger with an accessible labelled group', async () => {
        render(FullscreenNavFixture, { open: false });
        await flush();

        await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
        await page.getByTestId('trigger').click();
        await flush();

        await expect.element(page.getByRole('dialog')).toBeInTheDocument();
        await expect.element(page.getByRole('group', { name: 'Menu' })).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('closes after a navigation link is activated', async () => {
        render(FullscreenNavFixture, { open: true });
        await flush();

        await page.getByRole('link', { name: 'Home' }).click();
        await waitForClose();

        await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        render(FullscreenNavFixture, { open: false });
        await flush();

        const trigger = page.getByTestId('trigger').element() as HTMLElement;
        trigger.focus();
        await page.getByTestId('trigger').click();
        await flush();
        await userEvent.keyboard('{Escape}');
        await waitForClose();

        await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
        expect(document.activeElement).toBe(trigger);
    });
});

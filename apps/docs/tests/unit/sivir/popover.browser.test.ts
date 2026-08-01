import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import PopoverFixture from '../../fixtures/PopoverFixture.svelte';

/*
 * Browser-runner justified per strategy Sec.7.1: floating-ui positioning,
 * focus management across portal-like content, click-outside through
 * document-level listener, real keyboard event propagation.
 *
 * We do not verify the *exact* position from floating-ui (that's
 * floating-ui's own contract). We verify that positioning is APPLIED
 * (style.left/top set) and that the open/close lifecycle works.
 *
 * Initial and controlled open props are covered alongside trigger-driven
 * state so SSR and client behavior stay aligned.
 */

async function flush() {
    await tick();
    await tick();
    await new Promise((r) => setTimeout(r, 20));
}

async function openViaTrigger() {
    await page.getByTestId('popover-trigger-label').click();
    await flush();
}

describe('Popover -- mount and unmount', () => {
    it('does not render content when open=false', async () => {
        render(PopoverFixture, { open: false });
        await flush();
        await expect.element(page.getByText('Popover Title')).not.toBeInTheDocument();
    });

    it('renders content when open=true on mount', async () => {
        render(PopoverFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Popover Title')).toBeInTheDocument();
        await expect.element(page.getByText('Popover body content')).toBeInTheDocument();
    });

    it('opens when the trigger is clicked', async () => {
        render(PopoverFixture, { open: false });
        await flush();

        await page.getByTestId('popover-trigger-label').click();
        await flush();
        await expect.element(page.getByText('Popover Title')).toBeInTheDocument();
    });
});

describe('Popover -- close paths', () => {
    it('locks scrolling while open and restores it after closing', async () => {
        render(PopoverFixture, { open: false });
        await flush();
        await openViaTrigger();
        expect(document.body.style.overflow).toBe('hidden');

        await userEvent.keyboard('{Escape}');
        await flush();
        expect(document.body.style.overflow).not.toBe('hidden');
    });

    it('restores the page lock when closed from its trigger', async () => {
        render(PopoverFixture, { open: false });
        await flush();
        await openViaTrigger();
        expect(document.body.style.overflow).toBe('hidden');

        await page.getByTestId('popover-trigger-label').click();
        await flush();
        expect(document.body.style.overflow).not.toBe('hidden');
    });

    it('closes on Escape', async () => {
        render(PopoverFixture, { open: false });
        await flush();
        await openViaTrigger();
        await expect.element(page.getByText('Popover Title')).toBeInTheDocument();

        await userEvent.keyboard('{Escape}');
        await flush();
        await expect.element(page.getByText('Popover Title')).not.toBeInTheDocument();
    });

    it('closes on click outside (click on body)', async () => {
        render(PopoverFixture, { open: false });
        await flush();
        await openViaTrigger();
        await expect.element(page.getByText('Popover Title')).toBeInTheDocument();

        const outside = document.createElement('div');
        outside.textContent = 'outside';
        outside.style.position = 'absolute';
        outside.style.top = '400px';
        outside.style.left = '400px';
        outside.style.width = '100px';
        outside.style.height = '50px';
        let clicked = false;
        outside.onclick = () => {
            clicked = true;
        };
        document.body.appendChild(outside);

        outside.click();
        await flush();
        await expect.element(page.getByText('Popover Title')).not.toBeInTheDocument();
        expect(clicked).toBe(false);
        outside.remove();
    });

    it('does not close when clicking inside content', async () => {
        render(PopoverFixture, { open: false });
        await flush();
        await openViaTrigger();
        await expect.element(page.getByText('Popover Title')).toBeInTheDocument();

        await page.getByTestId('inside-popover').click();
        await flush();
        await expect.element(page.getByText('Popover Title')).toBeInTheDocument();
    });
});

describe('Popover -- positioning is applied', () => {
    it('applies inline positioning styles when open', async () => {
        render(PopoverFixture, { open: false });
        await flush();
        await openViaTrigger();

        const content = document.querySelector('[data-floating-content]') as HTMLElement;
        expect(content).toBeInTheDocument();
        expect(content.style.left).not.toBe('');
        expect(content.style.top).not.toBe('');
    });

    it.each(['top', 'bottom', 'left', 'right'] as const)(
        'accepts placement="%s" without errors',
        async (placement) => {
            render(PopoverFixture, { open: false, placement });
            await flush();
            await openViaTrigger();
            const content = document.querySelector('[data-floating-content]') as HTMLElement;
            expect(content).toBeInTheDocument();
        }
    );
});

describe('Popover -- hover behavior (hoverable=true)', () => {
    it('opens after pointer hover when hoverable=true', async () => {
        render(PopoverFixture, {
            open: false,
            hoverable: true,
            delay: 0,
            closeDelay: 50
        });
        await flush();

        const triggerLabel = document.querySelector(
            '[data-testid="popover-trigger-label"]'
        ) as HTMLElement;
        const triggerButton = triggerLabel.closest('button') as HTMLElement;
        expect(triggerButton).toBeInTheDocument();

        await userEvent.hover(triggerButton);
        await flush();
        await new Promise((r) => setTimeout(r, 100));
        await expect.element(page.getByText('Popover Title')).toBeInTheDocument();
    });
});

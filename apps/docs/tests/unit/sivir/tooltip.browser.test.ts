import { describe, expect, it, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { tick } from 'svelte';
import TooltipFixture from '../../fixtures/TooltipFixture.svelte';
import { resetSharedTooltipForTests } from '@sivir-ui/svelte/components/tooltip/shared-tooltip';

/*
 * Tooltip uses a shared body-level bubble. Tests assert its public surface:
 *   - role="tooltip" on the rendered content
 *   - hover-to-open with the wrapper's configured delay
 *   - hover-end-to-close with the wrapper's closeDelay
 *   - delay/closeDelay overrides propagate
 *
 * Popover's general behaviors (positioning, escape, click-outside)
 * are covered in popover.browser.test.ts -- not re-tested here.
 */

async function flush() {
    await tick();
    await tick();
    await new Promise((r) => setTimeout(r, 20));
}

// The visible tooltip is the shared, body-level bubble; Tooltip.Content only
// reports the authored label off-screen (it's always in the DOM).
function bubble() {
    return document.querySelector('[data-sivir-tooltip]') as HTMLElement | null;
}
function tooltipShown() {
    const el = bubble();
    return !!el && el.style.opacity === '1';
}

beforeEach(() => {
    resetSharedTooltipForTests();
});

describe('Tooltip -- closed initially, no bubble shown', () => {
    it('the shared bubble is not shown before hover', async () => {
        render(TooltipFixture, { delay: 10, closeDelay: 10 });
        await flush();
        expect(tooltipShown()).toBe(false);
    });
});

describe('Tooltip -- hover opens after the configured delay', () => {
    it('the bubble becomes visible after the pointer enters the trigger', async () => {
        render(TooltipFixture, { delay: 10, closeDelay: 10 });
        await flush();

        await page.getByTestId('tooltip-trigger').hover();
        // Wait past the open delay + a frame to settle.
        await new Promise((r) => setTimeout(r, 80));
        await flush();

        expect(tooltipShown()).toBe(true);
    });

    it('role="tooltip" is set on the rendered content', async () => {
        render(TooltipFixture, { delay: 10, closeDelay: 10 });
        await flush();
        await page.getByTestId('tooltip-trigger').hover();
        await new Promise((r) => setTimeout(r, 80));
        await flush();

        const tooltipEl = document.querySelector('[role="tooltip"]');
        expect(tooltipEl).toBeInTheDocument();
        // Assert the authored label through the off-screen reporter.
        const body = document.querySelector('[data-testid="tooltip-body"]');
        expect(body?.textContent).toContain('Tooltip content');
    });

    it('uses the default delay of 125ms when not overridden', async () => {
        render(TooltipFixture, {});
        await flush();
        const trigger = document.querySelector('[data-testid="tooltip-trigger"]')?.parentElement;
        trigger?.dispatchEvent(new MouseEvent('mouseenter'));
        await new Promise((r) => setTimeout(r, 20));
        await flush();

        // Roughly 40ms after hover, the default 125ms delay has not elapsed.
        expect(tooltipShown()).toBe(false);
    });
});

describe('Tooltip -- leave closes after closeDelay', () => {
    it('content goes away after pointer leaves the trigger', async () => {
        render(TooltipFixture, { delay: 10, closeDelay: 10 });
        await flush();

        await page.getByTestId('tooltip-trigger').hover();
        await new Promise((r) => setTimeout(r, 80));
        await flush();
        expect(tooltipShown()).toBe(true);

        // Move pointer away from trigger via synthetic leave events (vitest's
        // BrowserPage has no positional hover; element-level dispatch covers it).
        const trigger = document.querySelector('[data-testid="tooltip-trigger"]')?.parentElement;
        trigger?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        trigger?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
        await new Promise((r) => setTimeout(r, 80));
        await flush();

        expect(tooltipShown()).toBe(false);
    });
});

describe('Tooltip -- content is not interactive (aria-modal not applied for role="none" wrapper)', () => {
    it('no aria-modal attribute on the role="tooltip" content', async () => {
        render(TooltipFixture, { delay: 10, closeDelay: 10 });
        await flush();
        await page.getByTestId('tooltip-trigger').hover();
        await new Promise((r) => setTimeout(r, 80));
        await flush();

        const tooltipEl = document.querySelector('[role="tooltip"]');
        expect(tooltipEl).toBeInTheDocument();
        // role="tooltip" must NOT carry aria-modal -- only dialog/alertdialog do.
        expect(tooltipEl?.hasAttribute('aria-modal')).toBe(false);
    });
});

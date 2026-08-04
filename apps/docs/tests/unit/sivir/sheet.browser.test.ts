import { sheetIn, sheetOut } from '@sivir-ui/svelte/transition';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import SheetFixture from '../../fixtures/SheetFixture.svelte';
import { queryRequired, required } from '../../test-utils';

/*
 * Sheet uses Svelte in:/out: transitions (sheetIn/sheetOut), not a
 * visible/animationend state machine. Close paths wait for the out
 * transition to finish before content leaves the document.
 *
 * Browser-runner justified per strategy Sec.7.1: portal mount/unmount,
 * focus trap, click-outside, real keyboard event propagation,
 * transition lifecycle.
 */

async function flush() {
    await tick();
    await tick();
}

/** Wait long enough for sheetOut (~200–280ms) under normal motion. */
async function waitForClose() {
    await flush();
    await new Promise((r) => setTimeout(r, 350));
    await flush();
}

afterEach(() => {
    document.body.style.overflow = '';
});

describe('Sheet -- mount and unmount in real browser', () => {
    it('does not render content when open=false', async () => {
        render(SheetFixture, { open: false });
        await flush();
        await expect.element(page.getByText('Sheet Title')).not.toBeInTheDocument();
    });

    it('renders content when open=true', async () => {
        render(SheetFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();
        await expect.element(page.getByText('Sheet Description')).toBeInTheDocument();
    });

    it('opens after clicking the test trigger', async () => {
        render(SheetFixture, { open: false });
        await flush();
        await expect.element(page.getByText('Sheet Title')).not.toBeInTheDocument();

        await page.getByTestId('trigger').click();
        await flush();
        await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();
    });
});

describe('Sheet -- close paths', () => {
    it('unmounts content when Close button is clicked', async () => {
        render(SheetFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();

        await page.getByText('Close').click();
        await waitForClose();
        await expect.element(page.getByText('Sheet Title')).not.toBeInTheDocument();
    });

    it('unmounts content when Escape is pressed', async () => {
        render(SheetFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();

        await userEvent.keyboard('{Escape}');
        await waitForClose();
        await expect.element(page.getByText('Sheet Title')).not.toBeInTheDocument();
    });

    it('unmounts content on click outside (when allowClickOutside is true)', async () => {
        render(SheetFixture, { open: true, allowClickOutside: true });
        await flush();
        await new Promise((r) => setTimeout(r, 20));
        await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();

        const backdrop = document.querySelector('[data-ui="sheet-overlay"]') as HTMLElement;
        expect(backdrop).toBeInTheDocument();
        backdrop.click();
        await waitForClose();
        await expect.element(page.getByText('Sheet Title')).not.toBeInTheDocument();
    });

    it('does NOT unmount on click outside when allowClickOutside is false', async () => {
        render(SheetFixture, { open: true, allowClickOutside: false });
        await flush();
        await new Promise((r) => setTimeout(r, 20));
        await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();

        const backdrop = document.querySelector('[data-ui="sheet-overlay"]') as HTMLElement;
        expect(backdrop).toBeInTheDocument();
        backdrop.click();
        await flush();
        await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();
    });
});

describe('Sheet -- ARIA', () => {
    it('sets role="dialog"', async () => {
        render(SheetFixture, { open: true });
        await flush();
        const dialog = document.querySelector('[role="dialog"]');
        expect(dialog).toBeInTheDocument();
    });

    it('sets aria-modal="true"', async () => {
        render(SheetFixture, { open: true });
        await flush();
        const dialog = document.querySelector('[role="dialog"]');
        expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });

    it('exposes the side as data-side', async () => {
        render(SheetFixture, { open: true, side: 'left' });
        await flush();
        const panel = document.querySelector('[data-ui="sheet-content"]');
        expect(panel?.getAttribute('data-side')).toBe('left');
    });

    it('slides from the anchored edge without opacity fade', async () => {
        render(SheetFixture, { open: true, side: 'right' });
        await flush();
        const panel = queryRequired(document, '[data-ui="sheet-content"]');
        expect(panel.getAttribute('data-motion')).toBe('sheet');

        const enter = sheetIn(panel, { side: 'right' });
        const exit = sheetOut(panel, { side: 'right' });
        expect(enter.css?.(0, 1)).toContain('translate3d(100%, 0, 0)');
        expect(enter.css?.(1, 0)).toContain('translate3d(0%, 0, 0)');
        expect(enter.css?.(0, 1)).not.toContain('opacity');
        expect(exit.duration ?? 0).toBeLessThan(enter.duration ?? 0);

        const leftEnter = sheetIn(panel, { side: 'left' });
        expect(leftEnter.css?.(0, 1)).toContain('translate3d(-100%, 0, 0)');
    });

    it('sets aria-labelledby to a resolvable id', async () => {
        render(SheetFixture, { open: true });
        await flush();
        const dialog = document.querySelector('[role="dialog"]');
        const labelledBy = dialog?.getAttribute('aria-labelledby');
        expect(labelledBy).toBeTruthy();
        expect(document.getElementById(required(labelledBy))).toBeTruthy();
    });
});

describe('Sheet -- body scroll lock', () => {
    it('scrolls overflowing sheet content without unlocking the page', async () => {
        render(SheetFixture, { open: true, rows: 100 });
        await flush();

        const panel = document.querySelector('[data-ui="sheet-content"]') as HTMLElement;
        const surface = panel.firstElementChild as HTMLElement;
        expect(surface.scrollHeight).toBeGreaterThan(surface.clientHeight);

        surface.scrollTo({ top: 200 });
        expect(surface.scrollTop).toBe(200);
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('locks body scroll when open', async () => {
        render(SheetFixture, { open: true });
        await flush();
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll on close', async () => {
        render(SheetFixture, { open: true });
        await flush();
        expect(document.body.style.overflow).toBe('hidden');

        await page.getByText('Close').click();
        await waitForClose();
        expect(document.body.style.overflow).toBe('');
    });
});

describe('Sheet -- focus restoration', () => {
    it('returns focus to the trigger after close', async () => {
        render(SheetFixture, { open: false });
        await flush();

        const trigger = page.getByTestId('trigger').element() as HTMLElement;
        trigger.focus();
        expect(document.activeElement).toBe(trigger);

        await page.getByTestId('trigger').click();
        await flush();
        await expect.element(page.getByText('Sheet Title')).toBeInTheDocument();

        await page.getByText('Close').click();
        await waitForClose();
        await expect.element(page.getByText('Sheet Title')).not.toBeInTheDocument();
        expect(document.activeElement).toBe(trigger);
    });
});

import { dialogIn, dialogOut } from '@sivir-ui/svelte/transition';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ModalFixture from '../../fixtures/ModalFixture.svelte';
import { queryRequired, required } from '../../test-utils';

/*
 * Browser-mode tests for modal. These exercise mount/unmount, focus
 * management across the portal, click-outside, real keyboard event
 * propagation through document, and transition lifecycle -- i.e. the
 * checks that jsdom can't reliably perform.
 *
 * Per strategy Sec.7 (browser-runner policy): tests in this file justify
 * themselves against the list. Bullets: portal-mount/unmount, focus
 * trap across the portal boundary, click-outside, real keydown
 * dispatching through document, transition completion before content
 * becomes interactive.
 *
 * P3-F6 disambiguation: this file is where we find out whether the
 * close-doesn't-unmount issue is jsdom-only (these tests pass) or a
 * real Svelte 5 reactivity issue (these tests fail too).
 */

async function flush() {
    await tick();
    await tick();
}

afterEach(() => {
    document.body.style.overflow = '';
});

describe('Modal -- open/closed mount in real browser', () => {
    it('does not render Modal.Content when open=false', async () => {
        render(ModalFixture, { open: false });
        await flush();
        await expect.element(page.getByText('Modal Title')).not.toBeInTheDocument();
    });

    it('renders Modal.Content when open=true', async () => {
        render(ModalFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Modal Title')).toBeInTheDocument();
        await expect.element(page.getByText('Modal Description')).toBeInTheDocument();
    });

    it('opens after clicking the test trigger', async () => {
        render(ModalFixture, { open: false });
        await flush();
        await expect.element(page.getByText('Modal Title')).not.toBeInTheDocument();

        await page.getByTestId('trigger').click();
        await flush();
        await expect.element(page.getByText('Modal Title')).toBeInTheDocument();
    });
});

describe('Modal -- error browser chrome', () => {
    it('sets and restores theme-color while an error modal is open', async () => {
        const themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        themeColor.content = '#ffffff';
        document.head.append(themeColor);

        render(ModalFixture, { open: true, error: true });
        await flush();
        expect(themeColor.content).toBe('#dc2626');
        expect(page.getByText('Confirm').element().getAttribute('data-variant')).toBe(
            'destructive'
        );

        await page.getByText('Close').click();
        await flush();
        expect(themeColor.content).toBe('#ffffff');
        themeColor.remove();
    });
});

describe('Modal -- close paths actually unmount (P3-F6 disambiguation)', () => {
    it('releases body lock across repeated open and close cycles', async () => {
        render(ModalFixture, { open: false });
        await flush();

        for (let cycle = 0; cycle < 5; cycle += 1) {
            await page.getByTestId('trigger').click();
            await flush();
            expect(document.body.style.overflow).toBe('hidden');

            await page.getByText('Close').click();
            await flush();
            expect(document.body.style.overflow).toBe('');
        }
    }, 30_000);

    it('unmounts content when Close button is clicked', async () => {
        render(ModalFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Modal Title')).toBeInTheDocument();

        await page.getByText('Close').click();
        await flush();
        await expect.element(page.getByText('Modal Title')).not.toBeInTheDocument();
    });

    it('unmounts content when Confirm button is clicked', async () => {
        render(ModalFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Modal Title')).toBeInTheDocument();

        await page.getByText('Confirm').click();
        await flush();
        await expect.element(page.getByText('Modal Title')).not.toBeInTheDocument();
    });

    it('unmounts content when Escape is pressed', async () => {
        render(ModalFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Modal Title')).toBeInTheDocument();

        const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
        dialog.focus();
        await userEvent.keyboard('{Escape}');
        await flush();
        await expect.element(page.getByText('Modal Title')).not.toBeInTheDocument();
    });

    it('unmounts content on click outside (when allowClickOutside is true)', async () => {
        render(ModalFixture, { open: true, allowClickOutside: true });
        await flush();
        // clickOutside installs its document listener via setTimeout(0); wait
        // past that before dispatching the click.
        await new Promise((r) => setTimeout(r, 20));
        await expect.element(page.getByText('Modal Title')).toBeInTheDocument();

        const overlay = document.querySelector('[data-ui="modal-overlay"]') as HTMLElement;
        expect(overlay).toBeInTheDocument();
        overlay.click();
        await flush();
        await expect.element(page.getByText('Modal Title')).not.toBeInTheDocument();
    });

    it('does NOT unmount on click outside when allowClickOutside is false', async () => {
        render(ModalFixture, { open: true, allowClickOutside: false });
        await flush();
        await new Promise((r) => setTimeout(r, 20));
        await expect.element(page.getByText('Modal Title')).toBeInTheDocument();

        const overlay = document.querySelector('[data-ui="modal-overlay"]') as HTMLElement;
        expect(overlay).toBeInTheDocument();
        overlay.click();
        await flush();
        await expect.element(page.getByText('Modal Title')).toBeInTheDocument();
    });
});

describe('Modal -- ARIA contract in browser', () => {
    it('uses the vertical layout and compact width when requested', async () => {
        render(ModalFixture, { open: true, orientation: 'vertical' });
        await flush();

        const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
        const header = dialog.querySelector('[data-orientation]') as HTMLElement;

        expect(dialog.getAttribute('data-orientation')).toBe('vertical');
        expect(dialog.className).toContain('max-w-sm');
        expect(header.getAttribute('data-orientation')).toBe('vertical');
        expect(page.getByText('Confirm').element().className).toContain('sm:flex-1');
    });

    it('uses the horizontal layout and wide width by default', async () => {
        render(ModalFixture, { open: true });
        await flush();

        const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
        const header = dialog.querySelector('[data-orientation]') as HTMLElement;

        expect(dialog.getAttribute('data-orientation')).toBe('horizontal');
        expect(dialog.className).toContain('max-w-xl');
        expect(header.getAttribute('data-orientation')).toBe('horizontal');
        expect(header.className).toContain('flex-row');
        expect(page.getByText('Confirm').element().className).toContain('sm:w-fit');
    });

    it('uses the dedicated centered dialog motion', async () => {
        render(ModalFixture, { open: true });
        await flush();
        const dialog = document.querySelector('[role="dialog"]');
        const className = dialog?.getAttribute('class') ?? '';
        expect(dialog?.getAttribute('data-motion')).toBe('dialog');
        expect(className).toContain('origin-center');
    });

    it('enters upward and exits upward without retracing the enter path', async () => {
        render(ModalFixture, { open: true });
        await flush();
        const dialog = queryRequired(document, '[role="dialog"]');
        const enter = dialogIn(dialog);
        const exit = dialogOut(dialog);

        expect(enter.duration).toBe(180);
        expect(enter.css?.(0, 1)).toContain('translateY(4px) scale(0.93)');
        expect(exit.duration).toBe(110);
        expect(exit.css?.(0, 1)).toContain('translateY(-3px) scale(0.98)');
        expect(enter.easing?.(0.5)).toBeGreaterThan(exit.easing?.(0.5) ?? 1);
    });

    it('sets role="dialog" by default', async () => {
        render(ModalFixture, { open: true });
        await flush();
        const dialog = document.querySelector('[role="dialog"]');
        expect(dialog).toBeInTheDocument();
    });

    it('honors role="alertdialog" prop', async () => {
        render(ModalFixture, { open: true, role: 'alertdialog' });
        await flush();
        const dialog = document.querySelector('[role="alertdialog"]');
        expect(dialog).toBeInTheDocument();
    });

    it('sets aria-modal="true"', async () => {
        render(ModalFixture, { open: true });
        await flush();
        const dialog = document.querySelector('[role="dialog"]');
        expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });

    it('sets aria-labelledby pointing to a real id', async () => {
        render(ModalFixture, { open: true });
        await flush();
        const dialog = document.querySelector('[role="dialog"]');
        const labelledBy = dialog?.getAttribute('aria-labelledby');
        expect(labelledBy).toBeTruthy();
        expect(document.getElementById(required(labelledBy))).toBeTruthy();
    });

    it('sets aria-describedby pointing to a real id', async () => {
        render(ModalFixture, { open: true });
        await flush();
        const dialog = document.querySelector('[role="dialog"]');
        const describedBy = dialog?.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(required(describedBy))).toBeTruthy();
    });
});

describe('Modal -- body scroll lock in browser', () => {
    it('keeps the modal content surface scrollable while the page is locked', async () => {
        render(ModalFixture, { open: true });
        await flush();

        const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
        const surface = dialog.firstElementChild as HTMLElement;
        expect(document.body.style.overflow).toBe('hidden');
        expect(surface.className).toContain('overflow-y-auto');
        expect(surface.className).toContain('overscroll-contain');
    });

    it('locks body scroll when open', async () => {
        render(ModalFixture, { open: true });
        await flush();
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when closed via Close button', async () => {
        render(ModalFixture, { open: true });
        await flush();
        expect(document.body.style.overflow).toBe('hidden');

        await page.getByText('Close').click();
        await flush();
        expect(document.body.style.overflow).toBe('');
    });
});

describe('Modal -- focus management in browser', () => {
    it('places focus on a focusable inside the dialog after open', async () => {
        render(ModalFixture, { open: true });
        await flush();
        await new Promise((r) => setTimeout(r, 50));

        const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
        expect(dialog.contains(document.activeElement)).toBe(true);
    });

    it('traps focus inside the dialog (Tab from last focusable cycles to first)', async () => {
        render(ModalFixture, { open: true });
        await flush();
        await new Promise((r) => setTimeout(r, 50));

        // Find the LAST focusable inside the dialog and Tab from it.
        // trapFocus's keydown listener on `document` should cycle.
        const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
        const focusables = Array.from(
            dialog.querySelectorAll<HTMLElement>(
                'button, a[href], input, [tabindex]:not([tabindex="-1"])'
            )
        );
        const last = focusables[focusables.length - 1];
        const first = focusables[0];

        last.focus();
        expect(document.activeElement).toBe(last);

        await userEvent.keyboard('{Tab}');
        await flush();
        expect(document.activeElement).toBe(first);
    });
});

describe('Modal -- focus restoration', () => {
    it('returns focus to the trigger after close', async () => {
        render(ModalFixture, { open: false });
        await flush();

        const trigger = page.getByTestId('trigger').element() as HTMLElement;
        trigger.focus();
        expect(document.activeElement).toBe(trigger);

        await page.getByTestId('trigger').click();
        await flush();
        await expect.element(page.getByText('Modal Title')).toBeInTheDocument();

        await page.getByText('Close').click();
        await flush();
        await expect.element(page.getByText('Modal Title')).not.toBeInTheDocument();
        expect(document.activeElement).toBe(trigger);
    });
});

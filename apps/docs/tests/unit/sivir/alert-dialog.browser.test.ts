import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import AlertDialogFixture from '../../fixtures/AlertDialogFixture.svelte';

/*
 * AlertDialog is a thin modal wrapper post-collapse-safe per pattern
 * guide Sec.16.2 -- it asserts role="alertdialog", defaults allowClickOutside
 * to false, and exposes Exit/Confirm (no Close). Tests focus on the
 * distinctive wrapper contract, not modal behavior already covered in
 * modal.browser.test.ts.
 *
 * Browser-runner justified per strategy Sec.7.1: same as modal (portal
 * mount/unmount, focus trap, click-outside, real keyboard).
 */

async function flush() {
    await tick();
    await tick();
}

beforeEach(() => {
    document.body.style.overflow = '';
});

afterEach(() => {
    document.body.style.overflow = '';
});

describe('AlertDialog -- open/closed mount', () => {
    it('does not render content when open=false', async () => {
        render(AlertDialogFixture, { open: false });
        await flush();
        await expect.element(page.getByText('Delete project?')).not.toBeInTheDocument();
    });

    it('renders content when open=true', async () => {
        render(AlertDialogFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Delete project?')).toBeInTheDocument();
        await expect.element(page.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    });

    it('opens via the test trigger', async () => {
        render(AlertDialogFixture, { open: false });
        await flush();
        await page.getByTestId('trigger').click();
        await flush();
        await expect.element(page.getByText('Delete project?')).toBeInTheDocument();
    });
});

describe('AlertDialog -- error browser chrome', () => {
    it('passes error through to the modal root', async () => {
        const themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        themeColor.content = '#ffffff';
        document.head.append(themeColor);

        render(AlertDialogFixture, { open: true, error: true });
        await flush();
        expect(themeColor.content).toBe('#dc2626');
        expect(
            page.getByRole('button', { name: 'Delete' }).element().getAttribute('data-variant')
        ).toBe('destructive');

        await page.getByText('Cancel').click();
        await flush();
        expect(themeColor.content).toBe('#ffffff');
        themeColor.remove();
    });
});

describe('AlertDialog -- distinctive ARIA contract (role="alertdialog")', () => {
    it('renders role="alertdialog", not role="dialog"', async () => {
        render(AlertDialogFixture, { open: true });
        await flush();
        expect(document.querySelector('[role="alertdialog"]')).toBeInTheDocument();
        expect(document.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });

    it('sets aria-modal="true"', async () => {
        render(AlertDialogFixture, { open: true });
        await flush();
        expect(document.querySelector('[role="alertdialog"]')?.getAttribute('aria-modal')).toBe(
            'true'
        );
    });

    it('sets aria-labelledby pointing to the title', async () => {
        render(AlertDialogFixture, { open: true });
        await flush();
        const dialog = document.querySelector('[role="alertdialog"]')!;
        const labelledBy = dialog.getAttribute('aria-labelledby');
        expect(labelledBy).toBeTruthy();
        expect(document.getElementById(labelledBy!)?.textContent).toContain('Delete project?');
    });

    it('sets aria-describedby pointing to the description', async () => {
        render(AlertDialogFixture, { open: true });
        await flush();
        const dialog = document.querySelector('[role="alertdialog"]')!;
        const describedBy = dialog.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(describedBy!)?.textContent).toMatch(
            /this action cannot be undone/i
        );
    });
});

describe('AlertDialog -- default allowClickOutside=false (distinctive from Modal)', () => {
    it('does NOT close on backdrop click with default props', async () => {
        render(AlertDialogFixture, { open: true });
        await flush();
        await new Promise((r) => setTimeout(r, 20));
        await expect.element(page.getByText('Delete project?')).toBeInTheDocument();

        const overlay = document.querySelector('[data-ui="modal-overlay"]') as HTMLElement;
        expect(overlay).toBeInTheDocument();
        overlay.click();
        await flush();
        // Alert-dialog should stay open -- that's the whole point of the wrapper.
        await expect.element(page.getByText('Delete project?')).toBeInTheDocument();
    });

    it('does close on backdrop click when allowClickOutside is explicitly true', async () => {
        render(AlertDialogFixture, { open: true, allowClickOutside: true });
        await flush();
        await new Promise((r) => setTimeout(r, 20));
        await expect.element(page.getByText('Delete project?')).toBeInTheDocument();

        const overlay = document.querySelector('[data-ui="modal-overlay"]') as HTMLElement;
        overlay.click();
        await flush();
        await expect.element(page.getByText('Delete project?')).not.toBeInTheDocument();
    });
});

describe('AlertDialog -- Exit and Confirm buttons (distinctive from Modal Close/Confirm)', () => {
    it('Exit button closes the dialog', async () => {
        render(AlertDialogFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Delete project?')).toBeInTheDocument();

        await page.getByText('Cancel').click();
        await flush();
        await expect.element(page.getByText('Delete project?')).not.toBeInTheDocument();
    });

    it('Confirm button closes the dialog', async () => {
        render(AlertDialogFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Delete project?')).toBeInTheDocument();

        await page.getByRole('button', { name: 'Delete' }).click();
        await flush();
        await expect.element(page.getByText('Delete project?')).not.toBeInTheDocument();
    });
});

describe('AlertDialog -- Escape still closes', () => {
    it('closes on Escape', async () => {
        render(AlertDialogFixture, { open: true });
        await flush();
        await expect.element(page.getByText('Delete project?')).toBeInTheDocument();

        const dialog = document.querySelector('[role="alertdialog"]') as HTMLElement;
        dialog.focus();
        await userEvent.keyboard('{Escape}');
        await flush();
        await expect.element(page.getByText('Delete project?')).not.toBeInTheDocument();
    });
});

describe('AlertDialog -- body scroll lock (inherited from modal)', () => {
    it('locks body scroll when open', async () => {
        render(AlertDialogFixture, { open: true });
        await flush();
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll on Cancel', async () => {
        render(AlertDialogFixture, { open: true });
        await flush();
        expect(document.body.style.overflow).toBe('hidden');

        await page.getByText('Cancel').click();
        await flush();
        expect(document.body.style.overflow).toBe('');
    });
});

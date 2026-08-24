import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import CommandFixture from '../../fixtures/CommandFixture.svelte';
import { required } from '../../test-utils';

async function flush() {
    await tick();
    await tick();
    await new Promise((r) => setTimeout(r, 70));
}

async function openCommand() {
    await page.getByTestId('command-trigger').click();
    await flush();
}

afterEach(() => {
    document.body.style.overflow = '';
});

describe('Command -- open and close', () => {
    it('hides items initially', async () => {
        render(CommandFixture, {});
        await flush();
        await expect.element(page.getByTestId('cmd-profile')).not.toBeInTheDocument();
    });

    it('shows items + search input after opening', async () => {
        render(CommandFixture, {});
        await flush();
        await openCommand();
        await expect.element(page.getByTestId('cmd-profile')).toBeInTheDocument();
        await expect.element(page.getByTestId('cmd-settings')).toBeInTheDocument();
        await expect.element(page.getByTestId('cmd-logout')).toBeInTheDocument();
        await expect.element(page.getByPlaceholder('Search commands')).toBeInTheDocument();
    });

    it('uses Modal overlay and dialog motion', async () => {
        render(CommandFixture, {});
        await flush();
        await openCommand();

        const overlay = document.querySelector('[data-ui="modal-overlay"]');
        const dialog = document.querySelector('[data-ui="command-content"]');
        expect(overlay).toBeInTheDocument();
        expect(dialog).toBeInTheDocument();

        const className = dialog?.getAttribute('class') ?? '';
        expect(dialog?.getAttribute('data-motion')).toBe('dialog');
        expect(className).toContain('origin-center');
    });

    it('contains scrolling within the results surface', async () => {
        render(CommandFixture, {});
        await flush();
        await openCommand();

        const results = document.querySelector('[role="listbox"]') as HTMLElement;
        expect(results.className).toContain('overflow-y-auto');
        expect(results.className).toContain('overscroll-contain');
    });

    it('uses one traveling highlight for the result collection', async () => {
        render(CommandFixture, { open: true });
        await flush();
        const results = document.querySelector('[role="listbox"]') as HTMLElement;
        expect(results.querySelectorAll('.sivir-item-highlight')).toHaveLength(1);
        expect(results.querySelectorAll('[data-collection-item]')).toHaveLength(4);
    });

    it('closes on Escape', async () => {
        render(CommandFixture, {});
        await flush();
        await openCommand();

        await userEvent.keyboard('{Escape}');
        await flush();
        await expect.element(page.getByTestId('cmd-profile')).not.toBeInTheDocument();
        await expect.element(page.getByTestId('command-open-state')).toHaveTextContent('false');
    });

    it('supports controlled opening through bind:open', async () => {
        render(CommandFixture, { open: false });
        await flush();

        await page.getByTestId('command-external-trigger').click();
        await flush();
        await expect.element(page.getByTestId('cmd-profile')).toBeInTheDocument();
        await expect.element(page.getByTestId('command-open-state')).toHaveTextContent('true');
    });

    it('closes on outside click only when allowed', async () => {
        render(CommandFixture, { open: true, allowClickOutside: false });
        await flush();
        await new Promise((r) => setTimeout(r, 20));

        (document.querySelector('[data-ui="modal-overlay"]') as HTMLElement).click();
        await flush();
        await expect.element(page.getByTestId('cmd-profile')).toBeInTheDocument();

        await userEvent.keyboard('{Escape}');
        await flush();
        await expect.element(page.getByTestId('cmd-profile')).not.toBeInTheDocument();
    });

    it('restores focus and body scroll after closing', async () => {
        render(CommandFixture, {});
        await flush();
        const trigger = page
            .getByTestId('command-trigger')
            .element()
            .closest('button') as HTMLElement;

        trigger.focus();
        trigger.click();
        await flush();
        expect(document.body.style.overflow).toBe('hidden');

        await userEvent.keyboard('{Escape}');
        await flush();
        expect(document.body.style.overflow).toBe('');
        expect(document.activeElement).toBe(trigger);
    });

    it('restores body scroll when destroyed while open', async () => {
        const before = document.createElement('button');
        before.textContent = 'Before command';
        document.body.appendChild(before);
        before.focus();
        const view = render(CommandFixture, { open: true });
        await flush();
        expect(document.body.style.overflow).toBe('hidden');

        view.unmount();
        await flush();
        expect(document.body.style.overflow).toBe('');
        expect(document.activeElement).toBe(before);
        before.remove();
    });
});

describe('Command -- item activation', () => {
    it('fires the item callback on click', async () => {
        const onSettings = vi.fn();
        render(CommandFixture, { onSettings });
        await flush();
        await openCommand();

        await page.getByTestId('cmd-settings').click();
        await flush();
        expect(onSettings).toHaveBeenCalledTimes(1);
    });

    it('does not activate disabled items', async () => {
        const onDisabled = vi.fn();
        render(CommandFixture, { onDisabled });
        await flush();
        await openCommand();

        await page.getByTestId('cmd-disabled').click({ force: true });
        await flush();
        expect(onDisabled).not.toHaveBeenCalled();
        await expect.element(page.getByTestId('cmd-profile')).toBeInTheDocument();
    });
});

describe('Command -- search input', () => {
    it('focuses the search input when open', async () => {
        render(CommandFixture, {});
        await flush();
        await openCommand();
        await new Promise((r) => setTimeout(r, 50));

        const search = document.querySelector('input[placeholder="Search commands"]');
        expect(document.activeElement).toBe(search);
    });

    it('exposes combobox, listbox, and option semantics', async () => {
        render(CommandFixture, { open: true });
        await flush();

        const search = document.querySelector('[role="combobox"]');
        const listbox = document.querySelector('[role="listbox"]');
        const options = document.querySelectorAll('[role="option"]');
        expect(search).toBeInTheDocument();
        expect(listbox).toBeInTheDocument();
        expect(options).toHaveLength(4);
        expect(search?.getAttribute('aria-controls')).toBe(listbox?.id);
        expect(search?.getAttribute('aria-activedescendant')).toBe(options[0]?.id);
    });

    it('navigates results and skips disabled items', async () => {
        const onProfile = vi.fn();
        const onLogout = vi.fn();
        render(CommandFixture, { open: true, onProfile, onLogout });
        await flush();
        const search = document.querySelector('[role="combobox"]') as HTMLInputElement;

        expect(
            document.getElementById(required(search.getAttribute('aria-activedescendant')))
        ).toContainElement(page.getByTestId('cmd-profile').element());
        await userEvent.keyboard('{ArrowDown}{ArrowDown}');
        await flush();
        expect(
            document.getElementById(required(search.getAttribute('aria-activedescendant')))
        ).toContainElement(page.getByTestId('cmd-logout').element());

        await userEvent.keyboard('{Home}{Enter}');
        await flush();
        expect(onProfile).toHaveBeenCalledTimes(1);
        expect(onLogout).not.toHaveBeenCalled();
    });

    it('activates the matching filtered result with Enter', async () => {
        const onLogout = vi.fn();
        render(CommandFixture, { open: true, onLogout });
        await flush();

        await page.getByPlaceholder('Search commands').click();
        await userEvent.keyboard('logout');
        await flush();
        await expect.element(page.getByTestId('cmd-profile')).not.toBeVisible();
        await expect.element(page.getByTestId('cmd-logout')).toBeVisible();
        await userEvent.keyboard('{Enter}');
        await flush();
        expect(onLogout).toHaveBeenCalledTimes(1);
    });

    it('keeps filtered results hidden during the close animation after Enter', async () => {
        render(CommandFixture, { open: true });
        await flush();

        await page.getByPlaceholder('Search commands').fill('logout');
        await flush();
        await expect.element(page.getByTestId('cmd-profile')).not.toBeVisible();
        await userEvent.keyboard('{Enter}');
        await tick();

        await expect.element(page.getByTestId('cmd-profile')).not.toBeVisible();
    });

    it('matches one-character queries', async () => {
        render(CommandFixture, { open: true });
        await flush();

        await page.getByPlaceholder('Search commands').fill('p');
        await flush();
        await expect.element(page.getByTestId('cmd-profile')).toBeVisible();
        await expect.element(page.getByTestId('cmd-logout')).not.toBeVisible();
    });

    it('keeps short unrelated queries from matching every item', async () => {
        render(CommandFixture, { open: true });
        await flush();

        await page.getByPlaceholder('Search commands').fill('road');
        await flush();
        await expect.element(page.getByText('No results found')).toBeVisible();
        expect(
            [...document.querySelectorAll('[role="option"]')].filter(
                (el) => !(el as HTMLElement).hidden
            )
        ).toHaveLength(0);
    });
});

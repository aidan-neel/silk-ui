import { tick } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import ShortcutFixture from '../../fixtures/ShortcutFixture.svelte';
import { queryRequired } from '../../test-utils';

type KeyOptions = Pick<KeyboardEventInit, 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey' | 'repeat'>;

async function press(key: string, options: KeyOptions = {}, target: HTMLElement | Window = window) {
    const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
        ...options
    });
    target.dispatchEvent(event);
    await tick();
    return event;
}

describe('Shortcut -- activation', () => {
    it('activates its nearest Button and prevents the matched key event', async () => {
        const onactivate = vi.fn();
        render(ShortcutFixture, { shortcut: 'cmd+k', onactivate });

        const event = await press('k', { metaKey: true });

        expect(onactivate).toHaveBeenCalledOnce();
        expect(event.defaultPrevented).toBe(true);
    });

    it('opens a Command palette through its native Trigger click', async () => {
        render(ShortcutFixture, { mode: 'command', shortcut: 'ctrl+k' });

        await press('k', { ctrlKey: true });

        expect(document.querySelector('[role="dialog"]')).toBeInTheDocument();
    });

    it('supports standalone ontrigger activation', async () => {
        const onactivate = vi.fn();
        render(ShortcutFixture, { mode: 'standalone', shortcut: 'option+return', onactivate });

        await press('Enter', { altKey: true });

        expect(onactivate).toHaveBeenCalledOnce();
    });

    it('requires exact modifiers', async () => {
        const onactivate = vi.fn();
        render(ShortcutFixture, { shortcut: 'ctrl+k', onactivate });

        const missing = await press('k');
        const extra = await press('k', { ctrlKey: true, shiftKey: true });

        expect(onactivate).not.toHaveBeenCalled();
        expect(missing.defaultPrevented).toBe(false);
        expect(extra.defaultPrevented).toBe(false);
    });

    it('ignores editable targets, repeats, and disabled owners', async () => {
        const editableActivate = vi.fn();
        render(ShortcutFixture, { shortcut: 'k', onactivate: editableActivate });
        const input = queryRequired<HTMLInputElement>(document, '[data-testid="editable"]');

        await press('k', {}, input);
        await press('k', { repeat: true });
        expect(editableActivate).not.toHaveBeenCalled();

        const disabledActivate = vi.fn();
        render(ShortcutFixture, {
            shortcut: 'ctrl+d',
            disabled: true,
            onactivate: disabledActivate
        });
        const disabledEvent = await press('d', { ctrlKey: true });

        expect(disabledActivate).not.toHaveBeenCalled();
        expect(disabledEvent.defaultPrevented).toBe(false);
    });

    it('removes its listener when unmounted', async () => {
        const onactivate = vi.fn();
        const view = render(ShortcutFixture, { mode: 'standalone', shortcut: 'k', onactivate });
        view.unmount();

        await press('k');

        expect(onactivate).not.toHaveBeenCalled();
    });
});

describe('Shortcut -- parsing and display', () => {
    const cases: Array<{
        shortcut: string;
        key: string;
        options?: KeyOptions;
        label: string;
    }> = [
        { shortcut: 'cmd+k', key: 'k', options: { metaKey: true }, label: '⌘K' },
        { shortcut: 'command+k', key: 'k', options: { metaKey: true }, label: '⌘K' },
        { shortcut: 'meta+k', key: 'k', options: { metaKey: true }, label: '⌘K' },
        { shortcut: 'ctrl+k', key: 'k', options: { ctrlKey: true }, label: '⌃K' },
        { shortcut: 'control+k', key: 'k', options: { ctrlKey: true }, label: '⌃K' },
        { shortcut: 'shift+k', key: 'K', options: { shiftKey: true }, label: '⇧K' },
        { shortcut: 'alt+k', key: 'k', options: { altKey: true }, label: '⌥K' },
        { shortcut: 'option+k', key: 'k', options: { altKey: true }, label: '⌥K' },
        { shortcut: 'opt+k', key: 'k', options: { altKey: true }, label: '⌥K' },
        { shortcut: 'enter', key: 'Enter', label: '↵' },
        { shortcut: 'return', key: 'Enter', label: '↵' },
        { shortcut: 'esc', key: 'Escape', label: 'Esc' },
        { shortcut: 'escape', key: 'Escape', label: 'Esc' },
        { shortcut: 'tab', key: 'Tab', label: '⇥' },
        { shortcut: 'space', key: ' ', label: 'Space' },
        { shortcut: 'up', key: 'ArrowUp', label: '↑' },
        { shortcut: 'down', key: 'ArrowDown', label: '↓' },
        { shortcut: 'left', key: 'ArrowLeft', label: '←' },
        { shortcut: 'right', key: 'ArrowRight', label: '→' },
        { shortcut: 'backspace', key: 'Backspace', label: '⌫' },
        { shortcut: 'delete', key: 'Delete', label: '⌦' },
        { shortcut: 'plus', key: '+', label: '+' },
        { shortcut: '/', key: '/', label: '/' }
    ];

    for (const testCase of cases) {
        it(`uses one normalized contract for ${testCase.shortcut}`, async () => {
            const onactivate = vi.fn();
            const view = render(ShortcutFixture, {
                mode: 'standalone',
                shortcut: testCase.shortcut,
                onactivate
            });

            const shortcut = queryRequired<HTMLElement>(document, '[data-testid="shortcut"]');
            expect(shortcut.textContent).toBe(testCase.label);
            await press(testCase.key, testCase.options);
            expect(onactivate).toHaveBeenCalledOnce();

            view.unmount();
        });
    }

    it('fails safely for empty, unknown, and multiple base keys', async () => {
        for (const invalid of ['', 'hyper', 'k+x']) {
            const onactivate = vi.fn();
            const view = render(ShortcutFixture, {
                mode: 'standalone',
                shortcut: invalid,
                onactivate
            });

            expect(document.querySelector('[data-testid="shortcut"]')?.textContent).toBe('');
            await press('k');
            expect(onactivate).not.toHaveBeenCalled();
            view.unmount();
        }
    });
});

import { clickOutside, getFocusableElements, trapFocus } from '@sivir-ui/svelte/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { queryRequired } from '../../test-utils';

// offsetParent and element.animate are stubbed globally in tests/setup.ts.
// See that file for the rationale.

function makeButton(
    parent: HTMLElement,
    opts: { id?: string; text?: string; disabled?: boolean; ariaHidden?: boolean } = {}
) {
    const btn = document.createElement('button');
    if (opts.id) btn.id = opts.id;
    if (opts.text) btn.textContent = opts.text;
    if (opts.disabled) btn.setAttribute('disabled', '');
    if (opts.ariaHidden) btn.setAttribute('aria-hidden', 'true');
    parent.appendChild(btn);
    return btn;
}

function makeAnchor(parent: HTMLElement, href: string) {
    const a = document.createElement('a');
    a.setAttribute('href', href);
    parent.appendChild(a);
    return a;
}

function makeInput(parent: HTMLElement, type: string, opts: { disabled?: boolean } = {}) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    if (opts.disabled) input.setAttribute('disabled', '');
    parent.appendChild(input);
    return input;
}

describe('getFocusableElements', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        container.remove();
    });

    it('returns descendants matching the focusable selector', () => {
        makeButton(container, { text: 'btn' });
        makeAnchor(container, '/x');
        makeInput(container, 'text');
        const textarea = document.createElement('textarea');
        container.appendChild(textarea);
        const select = document.createElement('select');
        container.appendChild(select);
        const div = document.createElement('div');
        div.textContent = 'not focusable';
        container.appendChild(div);
        const tab0 = document.createElement('span');
        tab0.setAttribute('tabindex', '0');
        container.appendChild(tab0);
        const tabMinus = document.createElement('span');
        tabMinus.setAttribute('tabindex', '-1');
        container.appendChild(tabMinus);

        const focusables = getFocusableElements(container);
        const tags = focusables.map((el) => el.tagName.toLowerCase());
        expect(tags).toContain('button');
        expect(tags).toContain('a');
        expect(tags).toContain('input');
        expect(tags).toContain('textarea');
        expect(tags).toContain('select');
        expect(tags).toContain('span');
        expect(focusables.find((el) => el.getAttribute('tabindex') === '-1')).toBeUndefined();
    });

    it('excludes disabled elements', () => {
        makeButton(container, { text: 'enabled' });
        makeButton(container, { text: 'disabled', disabled: true });
        makeInput(container, 'text');
        makeInput(container, 'text', { disabled: true });

        const focusables = getFocusableElements(container);
        expect(focusables.length).toBe(2);
        expect(focusables.every((el) => !el.hasAttribute('disabled'))).toBe(true);
    });

    it('excludes elements with aria-hidden="true"', () => {
        makeButton(container, { text: 'visible' });
        makeButton(container, { text: 'hidden', ariaHidden: true });

        const focusables = getFocusableElements(container);
        expect(focusables.length).toBe(1);
        expect(focusables[0].textContent).toBe('visible');
    });

    it('excludes type="hidden" inputs', () => {
        makeInput(container, 'text');
        makeInput(container, 'hidden');

        const focusables = getFocusableElements(container);
        expect(focusables.length).toBe(1);
        expect((focusables[0] as HTMLInputElement).type).toBe('text');
    });

    it('returns an empty array when nothing is focusable', () => {
        const div = document.createElement('div');
        div.textContent = 'plain';
        container.appendChild(div);

        expect(getFocusableElements(container)).toEqual([]);
    });

    it('finds contenteditable elements', () => {
        const editable = document.createElement('div');
        editable.setAttribute('contenteditable', 'true');
        container.appendChild(editable);

        expect(getFocusableElements(container)).toHaveLength(1);
    });

    it('respects DOM order in the returned list', () => {
        makeButton(container, { id: 'a' });
        makeButton(container, { id: 'b' });
        makeButton(container, { id: 'c' });

        const ids = getFocusableElements(container).map((el) => el.id);
        expect(ids).toEqual(['a', 'b', 'c']);
    });
});

describe('trapFocus', () => {
    let dialog: HTMLDivElement;
    let outsideButton: HTMLButtonElement;
    let cleanup: (() => void) | undefined;

    beforeEach(() => {
        outsideButton = document.createElement('button');
        outsideButton.textContent = 'outside';
        document.body.appendChild(outsideButton);

        dialog = document.createElement('div');
        makeButton(dialog, { id: 'first' });
        makeButton(dialog, { id: 'mid' });
        makeButton(dialog, { id: 'last' });
        document.body.appendChild(dialog);
    });

    afterEach(() => {
        cleanup?.();
        cleanup = undefined;
        dialog.remove();
        outsideButton.remove();
    });

    it('returns a cleanup function when given an element', () => {
        cleanup = trapFocus(dialog);
        expect(typeof cleanup).toBe('function');
    });

    it('returns undefined when given no element', () => {
        const result = trapFocus(null as unknown as HTMLElement);
        expect(result).toBeUndefined();
    });

    it('focuses initialFocus when provided (P3-F4 fixed)', async () => {
        const mid = queryRequired<HTMLElement>(dialog, '#mid');
        cleanup = trapFocus(dialog, { initialFocus: mid });
        await new Promise((r) => queueMicrotask(() => r(undefined)));
        expect(document.activeElement).toBe(mid);
    });

    it('focuses first descendant when initialFocus is not provided', async () => {
        const first = queryRequired<HTMLElement>(dialog, '#first');
        cleanup = trapFocus(dialog);
        await new Promise((r) => queueMicrotask(() => r(undefined)));
        expect(document.activeElement).toBe(first);
    });

    it('cycles forward from last to first on Tab', async () => {
        const first = queryRequired<HTMLElement>(dialog, '#first');
        const last = queryRequired<HTMLElement>(dialog, '#last');
        cleanup = trapFocus(dialog);
        await new Promise((r) => queueMicrotask(() => r(undefined)));

        last.focus();
        expect(document.activeElement).toBe(last);

        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
        document.dispatchEvent(event);
        expect(document.activeElement).toBe(first);
    });

    it('cycles backward from first to last on Shift+Tab', async () => {
        const first = queryRequired<HTMLElement>(dialog, '#first');
        const last = queryRequired<HTMLElement>(dialog, '#last');
        cleanup = trapFocus(dialog);
        await new Promise((r) => queueMicrotask(() => r(undefined)));

        first.focus();
        expect(document.activeElement).toBe(first);

        const event = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
            bubbles: true
        });
        document.dispatchEvent(event);
        expect(document.activeElement).toBe(last);
    });

    it('restores focus to the previously focused element on cleanup', () => {
        outsideButton.focus();
        expect(document.activeElement).toBe(outsideButton);

        cleanup = trapFocus(dialog);
        const first = queryRequired<HTMLElement>(dialog, '#first');
        first.focus();
        expect(document.activeElement).toBe(first);

        cleanup?.();
        cleanup = undefined;
        expect(document.activeElement).toBe(outsideButton);
    });
});

describe('clickOutside', () => {
    let node: HTMLDivElement;
    let action: ReturnType<typeof clickOutside>;

    beforeEach(() => {
        node = document.createElement('div');
        makeButton(node, { id: 'inside' });
        document.body.appendChild(node);
    });

    afterEach(() => {
        action?.destroy();
        node.remove();
    });

    it('fires the callback on outside click', async () => {
        const callback = vi.fn();
        action = clickOutside(node, callback);

        await new Promise((r) => setTimeout(r, 1));

        const outside = document.createElement('button');
        document.body.appendChild(outside);
        outside.click();
        expect(callback).toHaveBeenCalled();
        outside.remove();
    });

    it('does not fire on clicks inside the node', async () => {
        const callback = vi.fn();
        action = clickOutside(node, callback);

        await new Promise((r) => setTimeout(r, 1));

        const inside = queryRequired<HTMLButtonElement>(node, '#inside');
        inside.click();
        expect(callback).not.toHaveBeenCalled();
    });

    it('does not fire on clicks inside excluded nodes', async () => {
        const excluded = document.createElement('div');
        makeButton(excluded, { id: 'exc' });
        document.body.appendChild(excluded);

        const callback = vi.fn();
        action = clickOutside(node, callback, [excluded]);

        await new Promise((r) => setTimeout(r, 1));

        const excButton = queryRequired<HTMLButtonElement>(excluded, '#exc');
        excButton.click();
        expect(callback).not.toHaveBeenCalled();

        excluded.remove();
    });

    it('does not fire on clicks inside [data-floating-content] elements', async () => {
        const floating = document.createElement('div');
        floating.setAttribute('data-floating-content', '');
        makeButton(floating, { id: 'float' });
        document.body.appendChild(floating);

        const callback = vi.fn();
        action = clickOutside(node, callback);

        await new Promise((r) => setTimeout(r, 1));

        const floatButton = queryRequired<HTMLButtonElement>(floating, '#float');
        floatButton.click();
        expect(callback).not.toHaveBeenCalled();

        floating.remove();
    });

    it('removes the listener on destroy', async () => {
        const callback = vi.fn();
        action = clickOutside(node, callback);

        await new Promise((r) => setTimeout(r, 1));

        action.destroy();

        const outside = document.createElement('button');
        document.body.appendChild(outside);
        outside.click();
        expect(callback).not.toHaveBeenCalled();
        outside.remove();
    });
});

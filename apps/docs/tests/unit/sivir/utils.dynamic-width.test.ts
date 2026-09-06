import { dynamicWidth } from '@sivir-ui/svelte/utils';
import { afterEach, describe, expect, it } from 'vitest';

function rect(width: number, height = 32): DOMRect {
    return {
        left: 0,
        top: 0,
        width,
        height,
        right: width,
        bottom: height,
        x: 0,
        y: 0,
        toJSON: () => ({})
    };
}

function mockLayout(item: HTMLElement, width: number) {
    Object.defineProperty(item, 'getBoundingClientRect', {
        value: () => rect(width),
        configurable: true
    });
    Object.defineProperty(item, 'getClientRects', {
        value: () => [rect(width)],
        configurable: true
    });
}

function setup(widths: number[]) {
    const panel = document.createElement('div');
    panel.setAttribute('data-ui', 'popover-content');
    const surface = document.createElement('div');
    const items = widths.map((width) => {
        const item = document.createElement('button');
        item.dataset.collectionItem = '';
        mockLayout(item, width);
        surface.append(item);
        return item;
    });
    panel.append(surface);
    document.body.append(panel);
    return { panel, surface, items };
}

async function settle() {
    await Promise.resolve();
    await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    );
}

afterEach(() => {
    document.body.replaceChildren();
});

describe('dynamicWidth', () => {
    it('sizes the panel to the largest item plus a 16px buffer', async () => {
        const { panel, surface } = setup([100, 140, 80]);
        const action = dynamicWidth(surface, { enabled: true });
        await settle();
        expect(panel.style.width).toBe('156px');
        action.destroy?.();
    });

    it('skips hidden items when measuring', async () => {
        const { panel, surface, items } = setup([200, 100]);
        items[0]?.setAttribute('hidden', '');
        const action = dynamicWidth(surface, { enabled: true });
        await settle();
        expect(panel.style.width).toBe('116px');
        action.destroy?.();
    });

    it('writes no width while disabled', async () => {
        const { panel, surface } = setup([140]);
        const action = dynamicWidth(surface, { enabled: false });
        await settle();
        expect(panel.style.width).toBe('');
        action.destroy?.();
    });

    it('re-measures when items are added', async () => {
        const { panel, surface } = setup([100]);
        const action = dynamicWidth(surface, { enabled: true });
        await settle();
        expect(panel.style.width).toBe('116px');

        const extra = document.createElement('button');
        extra.dataset.collectionItem = '';
        mockLayout(extra, 200);
        surface.append(extra);
        await settle();
        expect(panel.style.width).toBe('216px');
        action.destroy?.();
    });

    it('clears the width when disabled through update', async () => {
        const { panel, surface } = setup([140]);
        const action = dynamicWidth(surface, { enabled: true });
        await settle();
        expect(panel.style.width).toBe('156px');

        action.update?.({ enabled: false });
        await settle();
        expect(panel.style.width).toBe('');
        action.destroy?.();
    });
});

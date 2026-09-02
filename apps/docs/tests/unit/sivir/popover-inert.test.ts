import { afterEach, describe, expect, it } from 'vitest';
import { inertOutsidePopover } from '../../../../../packages/sivir/src/components/popover/inert';

const cleanups: (() => void)[] = [];

afterEach(() => {
    for (const cleanup of cleanups.splice(0)) {
        cleanup();
    }
    document.body.replaceChildren();
});

describe('popover outside inerting', () => {
    it('keeps the trigger path active while inerting sibling branches', () => {
        document.body.innerHTML = `
            <main>
                <button id="trigger">Open</button>
                <section id="branch">
                    <div id="popover" data-floating-content></div>
                </section>
                <a id="sibling" href="/outside">Outside</a>
            </main>
            <footer id="footer">Footer</footer>
        `;

        const popover = document.querySelector<HTMLElement>('#popover');
        const trigger = document.querySelector<HTMLElement>('#trigger');
        const sibling = document.querySelector<HTMLElement>('#sibling');
        const footer = document.querySelector<HTMLElement>('#footer');

        expect(popover).not.toBeNull();
        const cleanup = inertOutsidePopover(popover as HTMLElement, trigger);
        cleanups.push(cleanup);

        expect(trigger?.inert).not.toBe(true);
        expect(sibling?.inert).toBe(true);
        expect(footer?.inert).toBe(true);
        expect(popover?.inert).not.toBe(true);

        cleanup();

        expect(trigger?.inert).not.toBe(true);
        expect(sibling?.inert).toBe(false);
        expect(footer?.inert).toBe(false);
    });

    it('preserves prior inert state across nested retainers', () => {
        document.body.innerHTML = `
            <main id="outside">Outside</main>
            <div id="popover" data-floating-content></div>
        `;

        const outside = document.querySelector<HTMLElement>('#outside');
        const popover = document.querySelector<HTMLElement>('#popover');

        if (!outside || !popover) {
            throw new Error('Expected inert test fixtures.');
        }
        outside.inert = true;

        const cleanupFirst = inertOutsidePopover(popover);
        const cleanupSecond = inertOutsidePopover(popover);
        cleanups.push(cleanupFirst, cleanupSecond);

        cleanupFirst();
        expect(outside?.inert).toBe(true);

        cleanupSecond();
        expect(outside?.inert).toBe(true);
    });

    it('does not inert sibling overlay roots', () => {
        document.body.innerHTML = `
            <main id="outside">Outside</main>
            <div id="popover" data-floating-content></div>
            <div id="modal" data-overlay-root></div>
        `;

        const popover = document.querySelector<HTMLElement>('#popover');
        const outside = document.querySelector<HTMLElement>('#outside');
        const modal = document.querySelector<HTMLElement>('#modal');

        expect(popover).not.toBeNull();
        const cleanup = inertOutsidePopover(popover as HTMLElement);
        cleanups.push(cleanup);

        expect(outside?.inert).toBe(true);
        expect(modal?.inert).not.toBe(true);
        expect(popover?.inert).not.toBe(true);
    });

    it('inerts outside branches added while open', async () => {
        document.body.innerHTML = '<div id="popover" data-floating-content></div>';
        const popover = document.querySelector<HTMLElement>('#popover');

        expect(popover).not.toBeNull();
        const cleanup = inertOutsidePopover(popover as HTMLElement);
        cleanups.push(cleanup);
        const added = document.createElement('aside');
        document.body.appendChild(added);

        await Promise.resolve();

        expect(added.inert).toBe(true);
        cleanup();
        expect(added.inert).toBe(false);
    });
});

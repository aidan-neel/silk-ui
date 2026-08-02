import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import ReorderListFixture from '../../fixtures/ReorderListFixture.svelte';

describe('ReorderList pointer reordering', () => {
    it('tracks pointer movement without interpolating the dragged row position', async () => {
        render(ReorderListFixture);

        const first = page.getByRole('button', { name: 'First' }).element() as HTMLButtonElement;
        const list = first.closest('ol') as HTMLOListElement;
        const initialRect = first.getBoundingClientRect();
        const startY = initialRect.top + initialRect.height / 2;
        const pointerId = 1;
        list.setPointerCapture = () => {};
        list.hasPointerCapture = () => false;

        first.dispatchEvent(
            new PointerEvent('pointerdown', {
                bubbles: true,
                button: 0,
                clientY: startY,
                pointerId
            })
        );
        window.dispatchEvent(
            new PointerEvent('pointermove', {
                bubbles: true,
                clientY: startY + 20,
                pointerId
            })
        );
        await new Promise((resolve) => requestAnimationFrame(resolve));

        expect(first.getBoundingClientRect().top - initialRect.top).toBeCloseTo(20, 0);

        window.dispatchEvent(
            new PointerEvent('pointerup', {
                bubbles: true,
                clientY: startY + 20,
                pointerId
            })
        );
        await new Promise((resolve) => requestAnimationFrame(resolve));
        expect(first.getBoundingClientRect().top - initialRect.top).toBeGreaterThan(0);
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(first.getBoundingClientRect().top - initialRect.top).toBeCloseTo(0, 0);
    });

    it('moves and commits a row dragged over another row', async () => {
        render(ReorderListFixture);

        await userEvent.dragAndDrop(
            page.getByRole('button', { name: 'First' }),
            page.getByRole('button', { name: 'Third' })
        );

        await expect
            .element(page.getByRole('status', { name: 'Order' }))
            .toHaveTextContent('two,one,three');
        await expect.element(page.getByRole('status', { name: 'Commits' })).toHaveTextContent('1');
    });
});

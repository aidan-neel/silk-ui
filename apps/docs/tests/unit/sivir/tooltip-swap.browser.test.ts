import { describe, expect, it, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { tick } from 'svelte';
import TooltipSwapFixture from '../../fixtures/TooltipSwapFixture.svelte';
import { resetSharedTooltipForTests } from '@sivir-ui/svelte/components/tooltip/shared-tooltip';

/*
 * When a tooltip is already open and the pointer moves to another trigger, the
 * label must swap instantly. The shared bubble still slides/reshapes via CSS,
 * but the text is replaced synchronously.
 *
 * We sample the visible label shortly after the swap to cover the immediate
 * replacement contract.
 */

async function flush(ms = 30) {
    await tick();
    await new Promise((r) => setTimeout(r, ms));
}

function visibleLabel() {
    const el = document.querySelector('[data-sivir-tooltip]') as HTMLElement | null;
    if (!el) return '';
    const faces = el.querySelectorAll('.char-face');
    if (faces.length) {
        return Array.from(faces)
            .map((f) => f.textContent ?? '')
            .join('')
            .replace(/\s+/g, '');
    }
    return (el.textContent ?? '').replace(/\s+/g, '');
}

beforeEach(() => resetSharedTooltipForTests());

describe('Tooltip -- swapping triggers', () => {
    it('rebuilds the label instantly (no roll) when one tooltip is already open', async () => {
        render(TooltipSwapFixture, {});
        await flush();

        await page.getByTestId('trigger-a').hover();
        await flush(60);
        expect(visibleLabel()).toContain('Alpha');

        // Swap to the second trigger while the first bubble is still up.
        await page.getByTestId('trigger-b').hover();
        await new Promise((r) => setTimeout(r, 25));

        // Instant swap => fully "Bravo" already. A roll would still be interleaving.
        expect(visibleLabel()).toBe('Bravo');
    });
});

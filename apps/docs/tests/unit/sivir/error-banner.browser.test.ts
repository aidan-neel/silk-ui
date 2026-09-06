import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ComposerFixture from '../../fixtures/ComposerFixture.svelte';
import QuestionFixture from '../../fixtures/QuestionFixture.svelte';

describe('Error banners', () => {
    it('renders the Question error text without blur', async () => {
        const view = render(QuestionFixture, { status: 'idle' });
        await view.rerender({ status: 'error' });

        const alert = page.getByRole('alert');
        await expect.element(alert).toBeVisible();
        expect(getComputedStyle(alert.element()).filter).toBe('none');
        expect(animationFilters(alert.element())).toEqual([]);
    });

    it('renders the Composer error text without blur', async () => {
        const view = render(ComposerFixture, { status: 'idle' });
        await view.rerender({ status: 'error' });

        const alert = page.getByRole('alert');
        await expect.element(alert).toBeVisible();
        expect(getComputedStyle(alert.element()).filter).toBe('none');
        expect(animationFilters(alert.element())).toEqual([]);
    });
});

function animationFilters(element: HTMLElement | SVGElement) {
    return element
        .getAnimations()
        .flatMap((animation) => (animation.effect as KeyframeEffect | null)?.getKeyframes() ?? [])
        .map((frame) => frame.filter)
        .filter((filter) => filter !== undefined && filter !== 'none');
}

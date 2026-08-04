import { toast } from '@sivir-ui/svelte/components/toast';
import { tick } from 'svelte';
import { expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import MotionFixture from '../../fixtures/MotionFixture.svelte';
import { required } from '../../test-utils';

async function settle() {
    await tick();
    await tick();
    await new Promise((resolve) => setTimeout(resolve, 30));
}

it('computes every retained keyframe animation to none under reduced motion', async () => {
    render(MotionFixture);
    await settle();
    toast({ title: 'Reduced motion', duration: 10_000 });
    await settle();

    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);

    const skeleton = document.querySelector<HTMLElement>('[data-testid="motion-skeleton"] > div');
    const progress = document.querySelector<HTMLElement>('[data-testid="motion-progress"] > div');
    const toastProgress = document.querySelector<HTMLElement>(
        '[data-ui="toast"] [style*="animation-duration"]'
    );

    for (const element of [skeleton, progress, toastProgress]) {
        expect(element).toBeInTheDocument();
        expect(getComputedStyle(required(element)).animationName).toBe('none');
    }
});

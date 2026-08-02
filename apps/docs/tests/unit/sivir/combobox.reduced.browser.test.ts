import { expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { tick } from 'svelte';
import ComboboxFixture from '../../fixtures/ComboboxFixture.svelte';

it('disables result filtering motion when reduced motion is requested', async () => {
    render(ComboboxFixture, {});
    await page.getByTestId('combobox-trigger').click();

    const apple = page.getByText('Apple').element() as HTMLElement;
    const search = page.getByPlaceholder('Search fruits').element() as HTMLInputElement;
    search.value = 'cherry';
    search.dispatchEvent(new InputEvent('input', { bubbles: true, data: 'cherry' }));
    await tick();
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
    expect(apple).toHaveAttribute('data-visible', 'false');
    expect(apple.getAnimations()).toHaveLength(0);
    expect(apple.getBoundingClientRect().height).toBe(0);
});

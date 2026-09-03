import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import NestedModalFixture from '../../fixtures/NestedModalFixture.svelte';

async function flush() {
    await tick();
    await tick();
    await new Promise((r) => setTimeout(r, 20));
}

afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
});

describe('Nested Modal stacking', () => {
    it('keeps the parent open when nested Cancel is clicked', async () => {
        render(NestedModalFixture, { outerOpen: true, innerOpen: true });
        await flush();

        await expect
            .element(page.getByText('The new owner gets full control.'))
            .toBeInTheDocument();
        await expect
            .element(page.getByText('Change the name, or transfer this project.'))
            .toBeInTheDocument();

        await page.getByTestId('inner-cancel').click();
        await flush();

        await expect
            .element(page.getByText('The new owner gets full control.'))
            .not.toBeInTheDocument();
        await expect
            .element(page.getByText('Change the name, or transfer this project.'))
            .toBeInTheDocument();
        expect(document.querySelectorAll('[data-ui="modal-panel"]').length).toBe(1);
    });

    it('does not reopen the nested modal when the parent is opened again', async () => {
        render(NestedModalFixture);
        await flush();

        await page.getByTestId('open-outer').click();
        await flush();
        await page.getByTestId('open-inner').click();
        await flush();
        await page.getByTestId('inner-cancel').click();
        await flush();
        await page.getByTestId('outer-cancel').click();
        await expect
            .element(page.getByText('Change the name, or transfer this project.'))
            .not.toBeInTheDocument();
        expect(document.querySelectorAll('[data-ui="modal-panel"]').length).toBe(0);

        await page.getByTestId('open-outer').click();
        await flush();

        await expect
            .element(page.getByText('Change the name, or transfer this project.'))
            .toBeInTheDocument();
        await expect
            .element(page.getByText('The new owner gets full control.'))
            .not.toBeInTheDocument();
    });

    it('closes only the nested modal on click-outside', async () => {
        render(NestedModalFixture, { outerOpen: true, innerOpen: true });
        await flush();

        const nestedScrim = document.querySelector('[data-ui="modal-overlay"][data-nested]');
        expect(nestedScrim).toBeTruthy();
        (nestedScrim as HTMLElement).click();
        await flush();

        await expect
            .element(page.getByText('The new owner gets full control.'))
            .not.toBeInTheDocument();
        await expect
            .element(page.getByText('Change the name, or transfer this project.'))
            .toBeInTheDocument();
    });

    it('recedes the parent panel and lightens the nested scrim', async () => {
        render(NestedModalFixture, { outerOpen: true, innerOpen: true });
        await flush();

        const behind = document.querySelector('[data-ui="modal-panel"][data-stacked="behind"]');
        const nestedScrim = document.querySelector('[data-ui="modal-overlay"][data-nested]');
        expect(behind).toBeTruthy();
        expect(behind?.textContent).toContain('Change the name, or transfer this project.');
        expect(nestedScrim).toBeTruthy();
    });

    it('closes only the nested modal on Escape', async () => {
        render(NestedModalFixture, { outerOpen: true, innerOpen: true });
        await flush();

        await userEvent.keyboard('{Escape}');
        await flush();

        await expect
            .element(page.getByText('The new owner gets full control.'))
            .not.toBeInTheDocument();
        await expect
            .element(page.getByText('Change the name, or transfer this project.'))
            .toBeInTheDocument();
    });
});

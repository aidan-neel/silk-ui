import { tick } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import BasicComboboxExample from '../../../src/routes/docs/components/combobox/examples/basic.svelte';
import ComboboxFixture from '../../fixtures/ComboboxFixture.svelte';

async function flush() {
    await tick();
    await tick();
    await new Promise((r) => setTimeout(r, 20));
}

async function openCombobox() {
    await page.getByTestId('combobox-trigger').click();
    await flush();
}

async function expectHighlightToMatchOption(option: ReturnType<typeof page.getByText>) {
    await option.hover();
    await new Promise((r) => setTimeout(r, 300));

    expectHighlightBoundsToMatch(option.element());
}

function expectHighlightBoundsToMatch(option: HTMLElement | SVGElement) {
    const optionBounds = option.getBoundingClientRect();
    const highlightBounds = document
        .querySelector<HTMLElement>('.sivir-item-highlight')
        ?.getBoundingClientRect();

    expect(highlightBounds?.top).toBe(optionBounds.top);
    expect(highlightBounds?.left).toBe(optionBounds.left);
    expect(highlightBounds?.width).toBe(optionBounds.width);
    expect(highlightBounds?.height).toBe(optionBounds.height);
}

function expectOptionToBeFilteredOut(value: string) {
    const option = document.querySelector(`[data-combobox-value="${value}"]`);
    if (!option) {
        expect(option).toBeNull();
        return;
    }

    const motion = option.closest('[data-combobox-value]');

    expect(motion).toHaveAttribute('data-visible', 'false');
    expect(motion).toHaveAttribute('aria-hidden', 'true');
    expect(motion).toHaveAttribute('inert');
}

describe('Combobox -- open and close', () => {
    it('hides items initially', async () => {
        render(ComboboxFixture, {});
        await flush();
        await expect.element(page.getByText('Apple')).not.toBeInTheDocument();
    });

    it('shows items + search input after opening', async () => {
        render(ComboboxFixture, {});
        await flush();
        await openCombobox();

        await expect.element(page.getByText('Apple')).toBeInTheDocument();
        await expect.element(page.getByText('Banana')).toBeInTheDocument();
        await expect.element(page.getByText('Cherry')).toBeInTheDocument();
        await expect.element(page.getByPlaceholder('Search fruits')).toBeInTheDocument();
    });

    it('closes on Escape', async () => {
        render(ComboboxFixture, {});
        await flush();
        await openCombobox();

        await userEvent.keyboard('{Escape}');
        await flush();
        await expect.element(page.getByText('Apple')).not.toBeInTheDocument();
    });

    it('closes on click outside', async () => {
        render(ComboboxFixture, {});
        await flush();
        await openCombobox();
        await expect.element(page.getByText('Apple')).toBeInTheDocument();

        const outside = document.createElement('button');
        outside.textContent = 'outside';
        outside.style.position = 'fixed';
        outside.style.left = '8px';
        outside.style.top = '8px';
        document.body.append(outside);
        await new Promise((r) => setTimeout(r, 20));
        outside.click();
        await flush();
        await expect.element(page.getByText('Apple')).not.toBeInTheDocument();
        outside.remove();
    });
});

describe('Combobox -- item activation', () => {
    it('fires the item callback on click', async () => {
        const onBanana = vi.fn();
        render(ComboboxFixture, { onBanana });
        await flush();
        await openCombobox();

        await page.getByText('Banana').click();
        await flush();
        expect(onBanana).toHaveBeenCalledTimes(1);
    });

    it('keeps the filtered results visible during the close animation after Enter', async () => {
        render(ComboboxFixture, {});
        await flush();
        await openCombobox();

        await page.getByPlaceholder('Search fruits').fill('cherry');
        expectOptionToBeFilteredOut('apple');
        await userEvent.keyboard('{Enter}');
        await tick();

        expectOptionToBeFilteredOut('apple');
    });

    it('reopens immediately after selecting with Enter', async () => {
        render(ComboboxFixture, {});
        await flush();
        await openCombobox();

        await page.getByPlaceholder('Search fruits').fill('cherry');
        await userEvent.keyboard('{Enter}');
        await page.getByTestId('combobox-trigger').click();
        await new Promise((r) => setTimeout(r, 200));

        await expect.element(page.getByPlaceholder('Search fruits')).toBeInTheDocument();
        await expect.element(page.getByText('Apple')).toBeInTheDocument();
    });

    it('reopens immediately after selecting with a click', async () => {
        render(ComboboxFixture, {});
        await flush();
        await openCombobox();

        await page.getByText('Cherry').click();
        expect(document.body.style.overflow).not.toBe('hidden');
        expect(page.getByTestId('combobox-trigger').element()).not.toHaveClass(
            'pointer-events-none'
        );
        await page.getByTestId('combobox-trigger').click();
        await new Promise((r) => setTimeout(r, 200));

        await expect.element(page.getByPlaceholder('Search fruits')).toBeInTheDocument();
        await expect.element(page.getByText('Apple')).toBeInTheDocument();
    });
});

describe('Combobox -- search input', () => {
    it('uses a traveling highlight in the default docs example', async () => {
        render(BasicComboboxExample, {});
        await flush();

        await page.getByPlaceholder('Select a language').click();
        await flush();

        const spanish = page.getByText('Spanish');
        await expectHighlightToMatchOption(spanish);

        expect(document.querySelectorAll('.sivir-item-highlight')).toHaveLength(1);
    });

    it('focuses the search input when open', async () => {
        render(ComboboxFixture, {});
        await flush();
        await openCombobox();
        await new Promise((r) => setTimeout(r, 50));

        const search = document.querySelector('input[placeholder="Search fruits"]');
        expect(document.activeElement).toBe(search);
        expect(document.querySelectorAll('[role="combobox"]')).toHaveLength(1);
    });

    it('updates state.searchContent as user types', async () => {
        render(ComboboxFixture, {});
        await flush();
        await openCombobox();
        await new Promise((r) => setTimeout(r, 50));

        const search = document.querySelector(
            'input[placeholder="Search fruits"]'
        ) as HTMLInputElement;
        search.focus();
        await userEvent.type(search, 'app');
        await flush();

        expect(search.value).toBe('app');
    });

    it('matches one-character queries and shows an empty state when none match', async () => {
        render(ComboboxFixture, {});
        await flush();
        await openCombobox();

        const search = page.getByPlaceholder('Search fruits');
        await search.fill('h');
        await flush();
        await expect.element(page.getByText('Cherry')).toBeVisible();

        await search.fill('z');
        await flush();
        await expect.element(page.getByText('No results found')).toBeVisible();
    });

    it('smoothly collapses options removed by filtering', async () => {
        render(ComboboxFixture, {});
        await flush();
        await openCombobox();

        const appleMotion = page
            .getByText('Apple')
            .element()
            .closest<HTMLElement>('[data-combobox-value]');
        expect(appleMotion).not.toBeNull();
        const unrelatedAnimation = appleMotion?.animate(
            [{ color: 'currentColor' }, { color: 'currentColor' }],
            {
                duration: 1_000,
                iterations: Infinity
            }
        );

        const search = page.getByPlaceholder('Search fruits').element() as HTMLInputElement;
        search.value = 'cherry';
        search.dispatchEvent(new InputEvent('input', { bubbles: true, data: 'cherry' }));
        await tick();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

        expect(appleMotion?.isConnected).toBe(true);
        expect(appleMotion).toHaveAttribute('data-visible', 'false');
        expect(appleMotion).toHaveAttribute('inert');
        const animations = (appleMotion?.getAnimations() ?? []).filter(
            (animation) => animation instanceof CSSTransition
        );
        expect(animations).not.toHaveLength(0);
        expect(document.querySelector('.sivir-item-highlight')).toHaveClass('transition-none');

        await Promise.allSettled(animations.map((animation) => animation.finished));
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        expect(appleMotion?.getBoundingClientRect().height).toBe(0);
        expectHighlightBoundsToMatch(page.getByText('Cherry').element());
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(document.querySelector('.sivir-item-highlight')).not.toHaveClass('transition-none');
        unrelatedAnimation?.cancel();
    });

    it('moves the active option with Arrow keys before Enter selects it', async () => {
        const onBanana = vi.fn();
        render(ComboboxFixture, { onBanana });
        await flush();
        await openCombobox();
        expect(document.querySelector('[data-collection-active="true"]')).toHaveTextContent(
            'Apple'
        );
        await userEvent.keyboard('{ArrowDown}');
        expect(document.querySelector('[data-collection-active="true"]')).toHaveTextContent(
            'Banana'
        );
        await userEvent.keyboard('{Enter}');
        await flush();
        expect(onBanana).toHaveBeenCalledTimes(1);
    });

    it('moves the active highlight to the hovered option', async () => {
        render(ComboboxFixture, {});
        await flush();
        await openCombobox();

        await page.getByPlaceholder('Search fruits').fill('a');
        await flush();

        const banana = page.getByText('Banana');
        await expectHighlightToMatchOption(banana);

        expect(document.querySelector('[data-collection-active="true"]')).toHaveTextContent(
            'Banana'
        );
    });
});

describe('Combobox -- menu search', () => {
    it('keeps the trigger select-like and moves search into the menu', async () => {
        render(ComboboxFixture, { searchPlacement: 'menu' });
        await flush();

        const trigger = page.getByPlaceholder('Search fruits');
        await expect.element(trigger).toBeInTheDocument();
        expect((trigger.element() as HTMLInputElement).readOnly).toBe(true);
        await openCombobox();

        const search = page.getByPlaceholder('Search…');
        await expect.element(search).toBeInTheDocument();
        expect(document.activeElement).toBe(search.element());

        const searchField = search.element().closest<HTMLElement>('[data-ui="combobox-search"]');
        expect(searchField).not.toBeNull();
        expect(searchField).toHaveAttribute('data-variant', 'secondary');
        expect(searchField).toHaveClass(
            'h-[calc(var(--size-control-sm)+var(--sivir-space-1))]',
            'rounded-[var(--radius-lg)]',
            'bg-secondary'
        );
        expect(searchField?.parentElement?.firstElementChild).toBe(searchField);
        const searchFieldStyles = getComputedStyle(searchField as HTMLElement);
        expect([
            searchFieldStyles.borderTopWidth,
            searchFieldStyles.borderRightWidth,
            searchFieldStyles.borderBottomWidth,
            searchFieldStyles.borderLeftWidth
        ]).toEqual(['1px', '1px', '1px', '1px']);
        expect([
            searchFieldStyles.borderTopLeftRadius,
            searchFieldStyles.borderTopRightRadius,
            searchFieldStyles.borderBottomRightRadius,
            searchFieldStyles.borderBottomLeftRadius
        ]).not.toContain('0px');
        expect(Number.parseFloat(searchFieldStyles.height)).toBeLessThan(
            Number.parseFloat(getComputedStyle(trigger.element()).height)
        );
        expect(searchFieldStyles.boxShadow).toBe('none');

        await search.fill('cherry');
        await flush();

        expectOptionToBeFilteredOut('apple');
        await expect.element(page.getByText('Cherry')).toBeVisible();
    });

    it('moves the active highlight to the hovered option', async () => {
        render(ComboboxFixture, { searchPlacement: 'menu' });
        await flush();
        await openCombobox();

        const banana = page.getByText('Banana');
        await expectHighlightToMatchOption(banana);

        expect(document.querySelector('[data-collection-active="true"]')).toHaveTextContent(
            'Banana'
        );
    });
});

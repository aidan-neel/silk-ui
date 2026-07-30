import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
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
		await expect.element(page.getByText('Apple')).not.toBeInTheDocument();
		await userEvent.keyboard('{Enter}');
		await tick();

		await expect.element(page.getByText('Apple')).not.toBeInTheDocument();
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
		expect(page.getByTestId('combobox-trigger').element()).not.toHaveClass('pointer-events-none');
		await page.getByTestId('combobox-trigger').click();
		await new Promise((r) => setTimeout(r, 200));

		await expect.element(page.getByPlaceholder('Search fruits')).toBeInTheDocument();
		await expect.element(page.getByText('Apple')).toBeInTheDocument();
	});
});

describe('Combobox -- search input', () => {
	it('focuses the search input when open', async () => {
		render(ComboboxFixture, {});
		await flush();
		await openCombobox();
		await new Promise((r) => setTimeout(r, 50));

		const search = document.querySelector('input[placeholder="Search fruits"]');
		expect(document.activeElement).toBe(search);
	});

	it('updates state.searchContent as user types', async () => {
		render(ComboboxFixture, {});
		await flush();
		await openCombobox();
		await new Promise((r) => setTimeout(r, 50));

		const search = document.querySelector('input[placeholder="Search fruits"]') as HTMLInputElement;
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
});

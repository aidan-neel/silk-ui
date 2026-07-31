import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import { tick } from 'svelte';
import ContextMenuFixture from '../../fixtures/ContextMenuFixture.svelte';

async function flush() {
	await tick();
	await tick();
	await new Promise((r) => setTimeout(r, 20));
}

async function openContextMenu() {
	const trigger = document.querySelector('[data-testid="ctx-trigger"]') as HTMLElement;
	const event = new MouseEvent('contextmenu', {
		bubbles: true,
		cancelable: true,
		clientX: 100,
		clientY: 100
	});
	trigger.dispatchEvent(event);
	await flush();
}

describe('ContextMenu -- open via right-click', () => {
	it('does not show items initially', async () => {
		render(ContextMenuFixture, {});
		await flush();
		await expect.element(page.getByTestId('ctx-copy')).not.toBeInTheDocument();
	});

	it('opens on right-click of the trigger', async () => {
		render(ContextMenuFixture, {});
		await flush();
		await openContextMenu();

		await expect.element(page.getByTestId('ctx-copy')).toBeInTheDocument();
		await expect.element(page.getByTestId('ctx-paste')).toBeInTheDocument();
		await expect.element(page.getByTestId('ctx-delete')).toBeInTheDocument();
	});

	it('opens from a touch pointer interaction', async () => {
		render(ContextMenuFixture, {});
		await flush();

		const trigger = document.querySelector('[data-testid="ctx-trigger"]') as HTMLElement;
		trigger.dispatchEvent(
			new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'touch' })
		);
		await flush();

		await expect.element(page.getByTestId('ctx-copy')).toBeInTheDocument();
	});

	it('closes on Escape', async () => {
		render(ContextMenuFixture, {});
		await flush();
		await openContextMenu();

		await userEvent.keyboard('{Escape}');
		await flush();
		await expect.element(page.getByTestId('ctx-copy')).not.toBeInTheDocument();
	});

	it('closes on click outside', async () => {
		render(ContextMenuFixture, {});
		await flush();
		await openContextMenu();
		await expect.element(page.getByTestId('ctx-copy')).toBeInTheDocument();

		const outside = document.createElement('button');
		outside.textContent = 'outside';
		outside.style.position = 'fixed';
		outside.style.left = '8px';
		outside.style.top = '8px';
		document.body.append(outside);
		await new Promise((r) => setTimeout(r, 20));
		outside.click();
		await flush();
		await expect.element(page.getByTestId('ctx-copy')).not.toBeInTheDocument();
		outside.remove();
	});
});

describe('ContextMenu -- item activation', () => {
	it('fires the item callback on click', async () => {
		const onPaste = vi.fn();
		render(ContextMenuFixture, { onPaste });
		await flush();
		await openContextMenu();

		await page.getByTestId('ctx-paste').click();
		await flush();
		expect(onPaste).toHaveBeenCalledTimes(1);
	});
});

describe('ContextMenu -- positioning', () => {
	it('positions content based on pointer location (style.left/top set)', async () => {
		render(ContextMenuFixture, {});
		await flush();
		await openContextMenu();

		const content = document.querySelector('[data-floating-content]') as HTMLElement;
		expect(content).toBeInTheDocument();
		expect(content.style.left).not.toBe('');
		expect(content.style.top).not.toBe('');
	});
});

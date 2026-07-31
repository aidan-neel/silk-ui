import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { tick } from 'svelte';
import ApprovalRequestFixture from '../../fixtures/ApprovalRequestFixture.svelte';

/*
 * Decision-to-close behavior needs a real browser: the modal portals to body
 * and plays exit transitions before leaving the document, which jsdom does
 * not settle. Rendering/ARIA assertions stay in approval-request.test.ts.
 */

async function flush() {
	await tick();
	await tick();
}

beforeEach(() => {
	document.body.style.overflow = '';
});

afterEach(() => {
	document.body.style.overflow = '';
});

describe('ApprovalRequest -- decision closes the modal', () => {
	it('approves and closes immediately', async () => {
		render(ApprovalRequestFixture, { open: true });
		await flush();

		await page.getByRole('button', { name: 'Deploy' }).click();
		await flush();

		await expect.element(page.getByTestId('approval-callback')).toHaveTextContent('approve');
		await expect.element(page.getByRole('alertdialog')).not.toBeInTheDocument();
	});

	it('denies and closes immediately', async () => {
		render(ApprovalRequestFixture, { open: true });
		await flush();

		await page.getByRole('button', { name: 'Cancel' }).click();
		await flush();

		await expect.element(page.getByTestId('approval-callback')).toHaveTextContent('deny');
		await expect.element(page.getByRole('alertdialog')).not.toBeInTheDocument();
	});
});

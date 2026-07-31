import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import ApprovalRequestFixture from '../../fixtures/ApprovalRequestFixture.svelte';

describe('ApprovalRequest', () => {
	it('presents the request as a modal alertdialog with its details', async () => {
		const user = userEvent.setup();
		render(ApprovalRequestFixture);

		await user.click(screen.getByRole('button', { name: 'Open request' }));
		const dialog = await screen.findByRole('alertdialog', { name: 'Deploy to production?' });

		expect(dialog).toHaveAccessibleDescription(/Requires write access/);
		expect(screen.getByText('High risk')).toBeInTheDocument();
		expect(screen.getByText(/bun run deploy/)).toBeInTheDocument();
	});

	it('marks high-risk badges and confirmations as destructive', async () => {
		const user = userEvent.setup();
		render(ApprovalRequestFixture);

		await user.click(screen.getByRole('button', { name: 'Open request' }));
		expect(await screen.findByText('High risk')).toHaveAttribute('data-variant', 'destructive');
		expect(await screen.findByRole('button', { name: 'Deploy' })).toHaveAttribute(
			'data-variant',
			'destructive'
		);
	});

	it('keeps medium-risk confirmations on the primary variant', async () => {
		const user = userEvent.setup();
		render(ApprovalRequestFixture, { props: { risk: 'medium' } });

		await user.click(screen.getByRole('button', { name: 'Open request' }));
		expect(await screen.findByRole('button', { name: 'Deploy' })).toHaveAttribute(
			'data-variant',
			'primary'
		);
	});
});

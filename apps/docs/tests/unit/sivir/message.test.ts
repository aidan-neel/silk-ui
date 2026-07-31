import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/svelte';
import MessageFixture from '../../fixtures/MessageFixture.svelte';

describe('Message', () => {
	it.each(['assistant', 'user', 'system'] as const)(
		'identifies %s messages and their content',
		(from) => {
			const { container } = render(MessageFixture, { props: { from } });
			const message = container.querySelector('[data-ui="message"]');
			const content = container.querySelector('[data-ui="message-content"]');

			expect(message).toHaveAttribute('data-from', from);
			expect(content).toHaveAttribute('data-from', from);
			expect(content).toHaveTextContent('Deployment analysis complete.');
		}
	);

	it('renders author metadata and an accessible actions toolbar', () => {
		render(MessageFixture);

		expect(screen.getByText('Sivir')).toBeInTheDocument();
		expect(screen.getByText('14:32').tagName).toBe('TIME');
		const toolbar = screen.getByRole('toolbar', { name: 'Response actions' });
		expect(within(toolbar).getByRole('button', { name: 'Copy response' })).toBeInTheDocument();
	});

	it('marks streaming messages busy and exposes an error cue for failures', () => {
		const streaming = render(MessageFixture, { props: { status: 'streaming' } });
		expect(streaming.container.querySelector('[data-ui="message"]')).toHaveAttribute(
			'aria-busy',
			'true'
		);
		streaming.unmount();

		const failed = render(MessageFixture, { props: { status: 'error' } });
		expect(failed.container.querySelector('[data-ui="message"]')).toHaveAttribute(
			'aria-busy',
			'false'
		);
		expect(screen.getByText('Failed')).toBeInTheDocument();
	});
});

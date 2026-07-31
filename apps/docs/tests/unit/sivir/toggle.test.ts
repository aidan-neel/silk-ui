import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { createRawSnippet } from 'svelte';
import Toggle from '@sivir-ui/svelte/components/toggle/toggle.svelte';

function textSnippet(text: string) {
	return createRawSnippet(() => ({
		render: () => `<span>${text}</span>`
	}));
}

describe('Toggle -- rendering', () => {
	it('renders a button with aria-pressed', () => {
		render(Toggle, { props: { pressed: false } });
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button.getAttribute('aria-pressed')).toBe('false');
	});

	it('renders snippet children', () => {
		render(Toggle, { props: { pressed: false, children: textSnippet('Bold') } });
		expect(screen.getByRole('button')).toHaveTextContent('Bold');
	});
});

describe('Toggle -- pressed state', () => {
	it('aria-pressed reflects pressed=true', () => {
		render(Toggle, { props: { pressed: true } });
		expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
	});

	it('aria-pressed reflects pressed=false', () => {
		render(Toggle, { props: { pressed: false } });
		expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('false');
	});
});

describe('Toggle -- interaction', () => {
	it('toggles on click', async () => {
		render(Toggle, { props: { pressed: false } });
		const button = screen.getByRole('button');

		const user = userEvent.setup();
		await user.click(button);
		expect(button.getAttribute('aria-pressed')).toBe('true');
	});

	it('fires onPressedChange with the new state', async () => {
		const onPressedChange = vi.fn();
		render(Toggle, { props: { pressed: false, onPressedChange } });
		const button = screen.getByRole('button');

		const user = userEvent.setup();
		await user.click(button);
		expect(onPressedChange).toHaveBeenCalledWith(true);
	});

	it('does not toggle when disabled', async () => {
		const onPressedChange = vi.fn();
		render(Toggle, {
			props: { pressed: false, disabled: true, onPressedChange }
		});
		const button = screen.getByRole('button');

		const user = userEvent.setup();
		await user.click(button);
		expect(button.getAttribute('aria-pressed')).toBe('false');
		expect(onPressedChange).not.toHaveBeenCalled();
	});

	it('marks button as disabled when disabled=true', () => {
		render(Toggle, { props: { pressed: false, disabled: true } });
		expect(screen.getByRole('button')).toBeDisabled();
	});
});

describe('Toggle -- size and variant', () => {
	it.each(['sm', 'md', 'lg'] as const)('accepts size="%s" without throwing', (size) => {
		render(Toggle, { props: { pressed: false, size } });
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it.each(['default', 'outlined'] as const)('accepts variant="%s" without throwing', (variant) => {
		render(Toggle, { props: { pressed: false, variant } });
		expect(screen.getByRole('button')).toBeInTheDocument();
	});
});

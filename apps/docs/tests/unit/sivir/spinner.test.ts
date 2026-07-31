import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Spinner from '@sivir-ui/svelte/components/spinner/spinner.svelte';

describe('Spinner', () => {
	it('renders a LoaderCircle icon with the spin animation', () => {
		const { container } = render(Spinner, { props: { size: 20 } });
		const spinner = container.querySelector('[data-ui="spinner"]');
		expect(spinner).toHaveAttribute('width', '20');
		expect(spinner?.getAttribute('class')).toContain('animate-spin');
	});
});

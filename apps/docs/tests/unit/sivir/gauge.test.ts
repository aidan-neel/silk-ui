import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Gauge from '@sivir-ui/svelte/components/gauge/gauge.svelte';

describe('Gauge', () => {
    it('exposes a labeled meter with a clamped value', () => {
        const { getByRole } = render(Gauge, {
            props: { value: 120, max: 100, label: 'Monthly API usage' }
        });

        const gauge = getByRole('meter', { name: 'Monthly API usage' });
        expect(gauge).toHaveAttribute('aria-valuemin', '0');
        expect(gauge).toHaveAttribute('aria-valuemax', '100');
        expect(gauge).toHaveAttribute('aria-valuenow', '100');
        expect(gauge).toHaveTextContent('100');
    });

    it('renders its value and the requested tone', () => {
        const { container } = render(Gauge, { props: { value: 72, tone: 'warning' } });

        expect(container.querySelector('[data-ui="gauge"]')).toHaveTextContent('72');
        expect(container.querySelector('.text-warning')).toBeInTheDocument();
    });
});

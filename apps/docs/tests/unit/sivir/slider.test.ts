import Slider from '@sivir-ui/svelte/components/slider/slider.svelte';
import { render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import { queryRequired } from '../../test-utils';

describe('Slider -- rendering', () => {
    it('renders a range input', () => {
        const { container } = render(Slider, { props: { value: 50 } });
        const range = container.querySelector('input[type="range"]');
        expect(range).toBeInTheDocument();
    });

    it('exposes the value via aria-valuenow', () => {
        const { container } = render(Slider, { props: { value: 42 } });
        expect(container.querySelector('input[type="range"]')?.getAttribute('aria-valuenow')).toBe(
            '42'
        );
    });

    it('exposes min and max via aria attributes', () => {
        const { container } = render(Slider, {
            props: { value: 0, min: -10, max: 200 }
        });
        const range = queryRequired(container, 'input[type="range"]');
        expect(range.getAttribute('aria-valuemin')).toBe('-10');
        expect(range.getAttribute('aria-valuemax')).toBe('200');
    });

    it('uses the label prop as aria-label', () => {
        const { container } = render(Slider, {
            props: { value: 0, label: 'Volume' }
        });
        expect(container.querySelector('input[type="range"]')?.getAttribute('aria-label')).toBe(
            'Volume'
        );
    });
});

describe('Slider -- bounds and step', () => {
    it('reflects min and max on the underlying input', () => {
        const { container } = render(Slider, {
            props: { value: 5, min: 0, max: 10 }
        });
        const range = queryRequired<HTMLInputElement>(container, 'input[type="range"]');
        expect(range.min).toBe('0');
        expect(range.max).toBe('10');
    });

    it('reflects step on the underlying input', () => {
        const { container } = render(Slider, {
            props: { value: 0, step: 5 }
        });
        expect(container.querySelector<HTMLInputElement>('input[type="range"]')?.step).toBe('5');
    });
});

describe('Slider -- onValueChange callback', () => {
    it('fires onValueChange with the numeric new value on input', () => {
        const onValueChange = vi.fn();
        const { container } = render(Slider, {
            props: { value: 0, min: 0, max: 100, onValueChange }
        });
        const range = queryRequired<HTMLInputElement>(container, 'input[type="range"]');

        range.value = '37';
        range.dispatchEvent(new Event('input', { bubbles: true }));

        expect(onValueChange).toHaveBeenCalledWith(37);
    });
});

describe('Slider -- interaction feedback', () => {
    it('keeps the dragging state until the pointer is released', () => {
        const { container } = render(Slider, { props: { value: 0 } });
        const range = queryRequired<HTMLInputElement>(container, 'input[type="range"]');

        range.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        expect(range).toHaveAttribute('data-dragging');

        range.dispatchEvent(new Event('pointerup', { bubbles: true }));
        expect(range).not.toHaveAttribute('data-dragging');
    });

    it('does not enter the dragging state when disabled', () => {
        const { container } = render(Slider, { props: { value: 0, disabled: true } });
        const range = queryRequired<HTMLInputElement>(container, 'input[type="range"]');

        range.dispatchEvent(new Event('pointerdown', { bubbles: true }));

        expect(range).not.toHaveAttribute('data-dragging');
    });
});

describe('Slider -- disabled state', () => {
    it('disables the underlying range input', () => {
        const { container } = render(Slider, {
            props: { value: 50, disabled: true }
        });
        expect(container.querySelector('input[type="range"]')).toBeDisabled();
    });
});

import Checkbox from '@sivir-ui/svelte/components/checkbox/checkbox.svelte';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { queryRequired } from '../../test-utils';

describe('Checkbox -- rendering', () => {
    it('renders a native checkbox input', () => {
        const { container } = render(Checkbox, { props: { checked: false, variant: 'default' } });
        const input = container.querySelector('input[type="checkbox"]');
        expect(input).toBeInTheDocument();
    });

    it('renders the label when provided', () => {
        render(Checkbox, { props: { checked: false, variant: 'default', label: 'Subscribe' } });
        expect(screen.getByText('Subscribe')).toBeInTheDocument();
    });

    it('renders the description when provided', () => {
        render(Checkbox, {
            props: {
                checked: false,
                variant: 'default',
                label: 'Subscribe',
                description: 'Weekly emails about updates'
            }
        });
        expect(screen.getByText('Weekly emails about updates')).toBeInTheDocument();
    });
});

describe('Checkbox -- checked state', () => {
    it('reflects checked=false initially', () => {
        const { container } = render(Checkbox, {
            props: { checked: false, variant: 'default' }
        });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="checkbox"]');
        expect(input.checked).toBe(false);
    });

    it('reflects checked=true initially', () => {
        const { container } = render(Checkbox, {
            props: { checked: true, variant: 'default' }
        });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="checkbox"]');
        expect(input.checked).toBe(true);
    });

    it('exposes aria-checked matching the checked state', () => {
        const { container } = render(Checkbox, {
            props: { checked: false, variant: 'default' }
        });
        let input = queryRequired(container, 'input[type="checkbox"]');
        expect(input.getAttribute('aria-checked')).toBe('false');

        // Rerender with checked=true is tracked via the bindable; can't
        // fully test via rerender due to the F-6-class jsdom limitation,
        // but mounting with checked=true does set aria-checked correctly.
        const { container: container2 } = render(Checkbox, {
            props: { checked: true, variant: 'default' }
        });
        input = queryRequired(container2, 'input[type="checkbox"]');
        expect(input.getAttribute('aria-checked')).toBe('true');
    });
});

describe('Checkbox -- toggle interaction', () => {
    it('toggles checked when the input is clicked', async () => {
        const { container } = render(Checkbox, {
            props: { checked: false, variant: 'default' }
        });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="checkbox"]');
        expect(input.checked).toBe(false);

        const user = userEvent.setup();
        await user.click(input);
        expect(input.checked).toBe(true);
    });

    it('toggles back to unchecked on second click', async () => {
        const { container } = render(Checkbox, {
            props: { checked: true, variant: 'default' }
        });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="checkbox"]');
        expect(input.checked).toBe(true);

        const user = userEvent.setup();
        await user.click(input);
        expect(input.checked).toBe(false);
    });

    it('hides the input visually but keeps it accessible', () => {
        const { container } = render(Checkbox, {
            props: { checked: false, variant: 'default' }
        });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="checkbox"]');
        expect(input.className).toMatch(/opacity-0/);
    });
});

describe('Checkbox -- disabled state', () => {
    it('renders a disabled-style input when disabled=true', () => {
        const { container } = render(Checkbox, {
            props: { checked: false, variant: 'default', disabled: true }
        });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="checkbox"]');
        expect(input).toBeDisabled();
    });

    it('does not toggle on click when disabled', async () => {
        const { container } = render(Checkbox, {
            props: { checked: false, variant: 'default', disabled: true }
        });
        const input = queryRequired<HTMLInputElement>(container, 'input[type="checkbox"]');
        const user = userEvent.setup();
        await user.click(input);
        expect(input.checked).toBe(false);
    });
});

describe('Checkbox -- variants', () => {
    it('accepts variant="default" without throwing', () => {
        const { container } = render(Checkbox, {
            props: { checked: false, variant: 'default' }
        });
        expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    });

    it('accepts variant="primary" without throwing', () => {
        const { container } = render(Checkbox, {
            props: { checked: false, variant: 'primary' }
        });
        expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    });
});

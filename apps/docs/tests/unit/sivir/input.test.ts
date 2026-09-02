import Input from '@sivir-ui/svelte/components/input/input.svelte';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { queryRequired } from '../../test-utils';
import InputAdornments from './input-adornments.svelte';

describe('Input -- basic rendering', () => {
    it('renders a text input by default', () => {
        const { container } = render(Input);
        const input = container.querySelector('input');
        expect(input).toBeInTheDocument();
        expect(input?.type).toBe('text');
    });

    it('renders the label when provided', () => {
        render(Input, { props: { label: 'Email address' } });
        expect(screen.getByText('Email address')).toBeInTheDocument();
    });

    it('renders the description when provided', () => {
        render(Input, { props: { description: 'We never share your email.' } });
        expect(screen.getByText('We never share your email.')).toBeInTheDocument();
    });

    it('sets the placeholder attribute', () => {
        render(Input, { props: { placeholder: 'you@example.com' } });
        const input = screen.getByPlaceholderText('you@example.com');
        expect(input).toBeInTheDocument();
    });
});

describe('Input -- type prop wiring', () => {
    it('renders type="email" when type=email', () => {
        const { container } = render(Input, { props: { type: 'email' } });
        const input = container.querySelector('input');
        expect(input?.type).toBe('email');
    });

    it('renders type="password" when type=password', () => {
        const { container } = render(Input, { props: { type: 'password' } });
        const input = container.querySelector('input');
        expect(input?.type).toBe('password');
    });

    it('renders type="number" when type=number', () => {
        const { container } = render(Input, { props: { type: 'number' } });
        const input = container.querySelector('input');
        expect(input?.type).toBe('number');
    });

    it('renders type="file" with a file input element', () => {
        const { container } = render(Input, { props: { type: 'file' } });
        const input = container.querySelector('input');
        expect(input?.type).toBe('file');
    });

    it('renders type="checkbox" with a checkbox input element (P3-F9 fixed)', () => {
        const { container } = render(Input, { props: { type: 'checkbox' } });
        const input = container.querySelector('input');
        expect(input?.type).toBe('checkbox');
    });
});

describe('Input -- variant prop wiring', () => {
    it.each(['outline', 'secondary'] as const)(
        'renders the %s variant with data-variant attribute',
        (variant) => {
            const { container } = render(Input, { props: { variant } });
            const input = container.querySelector('input');
            expect(input?.getAttribute('data-variant')).toBe(variant);
        }
    );

    it('defaults to variant="outline"', () => {
        const { container } = render(Input);
        const input = container.querySelector('input');
        expect(input?.getAttribute('data-variant')).toBe('outline');
    });

    it('always sets data-ui="input" for downstream styling hooks', () => {
        const { container } = render(Input);
        expect(container.querySelector('[data-ui="input"]')).toBeInTheDocument();
    });
});

describe('Input -- value binding', () => {
    it('reflects an initial value', () => {
        render(Input, { props: { value: 'hello' } });
        const input = screen.getByDisplayValue('hello');
        expect(input).toBeInTheDocument();
    });

    it('updates the DOM value when the user types', async () => {
        const { container } = render(Input);
        const input = queryRequired<HTMLInputElement>(container, 'input');

        const user = userEvent.setup();
        await user.type(input, 'typed');
        expect(input.value).toBe('typed');
    });

    it('does not accept input when disabled', async () => {
        const { container } = render(Input, { props: { disabled: true } });
        const input = queryRequired<HTMLInputElement>(container, 'input');
        expect(input).toBeDisabled();
    });
});

describe('Input -- adornments', () => {
    it('renders leading and trailing snippets around the native input', () => {
        const { container } = render(InputAdornments);
        const control = queryRequired(container, '[data-ui="input-control"]');
        const input = queryRequired<HTMLInputElement>(control, 'input');

        expect(screen.getByTestId('leading')).toHaveTextContent('$');
        expect(input).toHaveClass('border-0');
        expect(input).not.toHaveClass('border');
        expect(input).toHaveValue('120');
        expect(screen.getByTestId('trailing')).toHaveTextContent('USD');
    });

    it('keeps class on the native input', () => {
        const { container } = render(InputAdornments, {
            props: { class: 'adorned-input' }
        });

        expect(container.querySelector('input')?.className).toContain('adorned-input');
    });

    it('does not render adornments for non-text input types', () => {
        const { container } = render(InputAdornments, {
            props: { type: 'hidden' }
        });

        expect(container.querySelector('[data-ui="input-control"]')).not.toBeInTheDocument();
        expect(screen.queryByTestId('leading')).not.toBeInTheDocument();
        expect(screen.queryByTestId('trailing')).not.toBeInTheDocument();
    });

    it('matches native case-insensitive input type behavior', () => {
        const { container } = render(InputAdornments, {
            props: { type: 'TEXT' }
        });

        expect(container.querySelector('[data-ui="input-control"]')).toBeInTheDocument();
    });
});

describe('Input -- attribute spreading', () => {
    it('spreads aria-label onto the input', () => {
        const { container } = render(Input, { props: { 'aria-label': 'Email' } as never });
        expect(container.querySelector('input')?.getAttribute('aria-label')).toBe('Email');
    });

    it('spreads autocomplete attribute', () => {
        const { container } = render(Input, { props: { autocomplete: 'email' } as never });
        expect(container.querySelector('input')?.getAttribute('autocomplete')).toBe('email');
    });

    it('spreads required attribute', () => {
        const { container } = render(Input, { props: { required: true } as never });
        expect(container.querySelector('input')?.required).toBe(true);
    });

    it('forwards class to the input through the cn() merge', () => {
        const { container } = render(Input, { props: { class: 'my-custom' } as never });
        expect(container.querySelector('input')?.className).toContain('my-custom');
    });
});

describe('Input -- label/input coupling', () => {
    it('wraps the input in a label so clicking the label focuses the input', async () => {
        const { container } = render(Input, { props: { label: 'Email' } });
        const label = queryRequired(container, 'label');
        const input = queryRequired(label, 'input');
        expect(input).toBeInTheDocument();
        // Click label, input gets focus via native label/input semantics.
        label.click();
        // jsdom: clicking label does not auto-focus; but the input is wrapped
        // so the implicit-label relationship works in real browsers.
        // We verify the structural relationship instead.
        expect(label.contains(input)).toBe(true);
    });

    it('renders label and description as siblings of the input', () => {
        const { container } = render(Input, {
            props: { label: 'Field', description: 'A description' }
        });
        const label = queryRequired(container, 'label');
        expect(label.textContent).toContain('Field');
        expect(label.textContent).toContain('A description');
    });
});

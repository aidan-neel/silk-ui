import Textarea from '@sivir-ui/svelte/components/textarea/textarea.svelte';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import TextareaComposerFixture from '../../fixtures/TextareaComposerFixture.svelte';
import { queryRequired } from '../../test-utils';

describe('Textarea -- basic rendering', () => {
    it('renders a textarea element', () => {
        const { container } = render(Textarea);
        expect(container.querySelector('textarea')).toBeInTheDocument();
    });

    it('renders the label when provided', () => {
        render(Textarea, { props: { label: 'Comments' } });
        expect(screen.getByText('Comments')).toBeInTheDocument();
    });

    it('renders the description when provided', () => {
        render(Textarea, { props: { description: 'Tell us more' } });
        expect(screen.getByText('Tell us more')).toBeInTheDocument();
    });

    it('sets the placeholder', () => {
        render(Textarea, { props: { placeholder: 'Type here...' } });
        expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
    });
});

describe('Textarea -- composer', () => {
    it('creates one shared surface for toolbar content', () => {
        const { container } = render(TextareaComposerFixture);
        expect(container.querySelector('[data-ui="textarea-composer"]')).toContainElement(
            container.querySelector('textarea')
        );
        expect(container.querySelector('[role="toolbar"]')).toBeInTheDocument();
    });
});

describe('Textarea -- variants', () => {
    it.each(['outline', 'secondary'] as const)(
        'accepts variant="%s" without throwing',
        (variant) => {
            const { container } = render(Textarea, { props: { variant } });
            expect(container.querySelector('textarea')).toBeInTheDocument();
        }
    );
});

describe('Textarea -- value binding', () => {
    it('reflects an initial value', () => {
        render(Textarea, { props: { value: 'hello world' } });
        expect(screen.getByDisplayValue('hello world')).toBeInTheDocument();
    });

    it('updates the DOM value when the user types', async () => {
        const { container } = render(Textarea);
        const textarea = queryRequired<HTMLTextAreaElement>(container, 'textarea');
        const user = userEvent.setup();
        await user.type(textarea, 'multi\nline');
        expect(textarea.value).toBe('multi\nline');
    });

    it('grows to its content when autoresize is enabled', async () => {
        const { container } = render(Textarea, { props: { autoresize: true } });
        const textarea = queryRequired<HTMLTextAreaElement>(container, 'textarea');
        Object.defineProperty(textarea, 'scrollHeight', { configurable: true, value: 144 });
        const user = userEvent.setup();
        await user.type(textarea, 'A longer message');
        expect(textarea.style.height).toBe('144px');
    });

    it('does not accept input when disabled', () => {
        const { container } = render(Textarea, { props: { disabled: true } });
        expect(container.querySelector('textarea')).toBeDisabled();
    });
});

describe('Textarea -- attribute spreading', () => {
    it('spreads aria-label', () => {
        const { container } = render(Textarea, {
            props: { 'aria-label': 'Comment box' } as never
        });
        expect(container.querySelector('textarea')?.getAttribute('aria-label')).toBe('Comment box');
    });

    it('spreads rows attribute', () => {
        const { container } = render(Textarea, { props: { rows: 8 } as never });
        expect(container.querySelector('textarea')?.rows).toBe(8);
    });

    it('spreads required', () => {
        const { container } = render(Textarea, { props: { required: true } as never });
        expect(container.querySelector('textarea')?.required).toBe(true);
    });

    it('forwards class to the textarea', () => {
        const { container } = render(Textarea, { props: { class: 'my-ta' } as never });
        expect(container.querySelector('textarea')?.className).toContain('my-ta');
    });
});

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { createRawSnippet } from 'svelte';
import Button from '@sivir-ui/svelte/components/button/button.svelte';

function textSnippet(text: string) {
    return createRawSnippet(() => ({
        render: () => `<span>${text}</span>`
    }));
}

describe('Button -- rendering and DOM element selection', () => {
    it('renders as <button> by default', () => {
        render(Button, { props: { children: textSnippet('Click me') } });
        const el = screen.getByRole('button');
        expect(el).toBeInTheDocument();
        expect(el.tagName).toBe('BUTTON');
    });

    it('renders as <a> when href is provided', () => {
        render(Button, { props: { href: '/somewhere', children: textSnippet('Link') } });
        const el = screen.getByRole('link');
        expect(el).toBeInTheDocument();
        expect(el.tagName).toBe('A');
        expect(el).toHaveAttribute('href', '/somewhere');
    });

    it('forwards the bindable element to the right node type', () => {
        const buttonResult = render(Button, { props: { children: textSnippet('x') } });
        expect(buttonResult.container.querySelector('button')).toBeTruthy();

        const linkResult = render(Button, { props: { href: '/a', children: textSnippet('x') } });
        expect(linkResult.container.querySelector('a')).toBeTruthy();
    });
});

describe('Button -- variant prop wiring', () => {
    const variants = ['primary', 'secondary', 'ghost', 'outline', 'destructive', 'panel'] as const;

    for (const variant of variants) {
        it(`renders the "${variant}" variant without throwing`, () => {
            const result = render(Button, {
                props: { variant, children: textSnippet(variant) }
            });
            expect(result.container.querySelector('button')).toBeTruthy();
        });
    }

    it('renders without an explicit variant (default = primary)', () => {
        const result = render(Button, { props: { children: textSnippet('x') } });
        expect(result.container.querySelector('button')).toBeTruthy();
    });
});

describe('Button -- size prop wiring', () => {
    const sizes = ['sm', 'md', 'lg', 'icon'] as const;

    for (const size of sizes) {
        it(`renders the "${size}" size`, () => {
            const result = render(Button, { props: { size, children: textSnippet(size) } });
            expect(result.container.querySelector('button')).toBeTruthy();
        });
    }
});

describe('Button -- click behavior', () => {
    it('fires onclick when activated by mouse', async () => {
        const onclick = vi.fn();
        render(Button, { props: { onclick, children: textSnippet('Click') } });
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        expect(onclick).toHaveBeenCalledTimes(1);
    });

    it('does not fire onclick when disabled', async () => {
        const onclick = vi.fn();
        render(Button, {
            props: { onclick, disabled: true, children: textSnippet('Disabled') }
        });
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        expect(onclick).not.toHaveBeenCalled();
    });

    it('reflects the disabled prop on the DOM element', () => {
        render(Button, { props: { disabled: true, children: textSnippet('x') } });
        const el = screen.getByRole('button');
        expect(el).toBeDisabled();
    });
});

describe('Button -- pointer events (renamed in 2.0.0)', () => {
    it('fires onpointerenter when a pointer enters the button', () => {
        const onpointerenter = vi.fn();
        render(Button, {
            props: { onpointerenter, children: textSnippet('Hover me') } as never
        });
        const el = screen.getByRole('button');
        el.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
        expect(onpointerenter).toHaveBeenCalledTimes(1);
    });

    it('fires onpointerleave when a pointer leaves the button', () => {
        const onpointerleave = vi.fn();
        render(Button, {
            props: { onpointerleave, children: textSnippet('Hover me') } as never
        });
        const el = screen.getByRole('button');
        el.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
        expect(onpointerleave).toHaveBeenCalledTimes(1);
    });

    it('fires onpointerenter on the anchor variant too', () => {
        const onpointerenter = vi.fn();
        render(Button, {
            props: {
                onpointerenter,
                href: '/somewhere',
                children: textSnippet('Hover link')
            } as never
        });
        const el = screen.getByRole('link');
        el.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
        expect(onpointerenter).toHaveBeenCalledTimes(1);
    });

    it('fires both pointerenter and pointerleave in sequence', () => {
        const onpointerenter = vi.fn();
        const onpointerleave = vi.fn();
        render(Button, {
            props: {
                onpointerenter,
                onpointerleave,
                children: textSnippet('Hover')
            } as never
        });
        const el = screen.getByRole('button');
        el.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
        el.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
        expect(onpointerenter).toHaveBeenCalledTimes(1);
        expect(onpointerleave).toHaveBeenCalledTimes(1);
    });
});

describe('Button -- keyboard activation', () => {
    it('fires onclick when activated by keyboard (button mode)', async () => {
        const onclick = vi.fn();
        render(Button, { props: { onclick, children: textSnippet('Press') } });
        const el = screen.getByRole('button');
        el.focus();

        const user = userEvent.setup();
        await user.keyboard('{Enter}');
        expect(onclick).toHaveBeenCalled();
    });

    it('responds to Space in button mode', async () => {
        const onclick = vi.fn();
        render(Button, { props: { onclick, children: textSnippet('Press') } });
        const el = screen.getByRole('button');
        el.focus();

        const user = userEvent.setup();
        await user.keyboard(' ');
        expect(onclick).toHaveBeenCalled();
    });
});

describe('Button -- content', () => {
    it('renders snippet children', () => {
        render(Button, { props: { children: textSnippet('Submit') } });
        expect(screen.getByRole('button')).toHaveTextContent('Submit');
    });
});

describe('Button -- async status', () => {
    it('keeps loading focusable, refuses activation, and exposes busy state', async () => {
        const onclick = vi.fn();
        render(Button, {
            props: {
                status: 'loading',
                loadingLabel: 'Publishing…',
                onclick,
                children: textSnippet('Publish')
            }
        });
        const button = screen.getByRole('button', { name: 'Publishing…' });
        expect(button).toHaveAttribute('aria-busy', 'true');
        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(button).not.toBeDisabled();
        await userEvent.setup().click(button);
        expect(onclick).not.toHaveBeenCalled();
    });

    it('reserves every supplied face in the same grid cell', () => {
        const { container } = render(Button, {
            props: {
                status: 'success',
                loadingLabel: 'Publishing…',
                successLabel: 'Published',
                errorLabel: 'Try again',
                children: textSnippet('Publish')
            }
        });
        const faces = container.querySelectorAll('.sivir-button-face');
        expect(faces).toHaveLength(4);
        expect(Array.from(faces).every((face) => face.classList.contains('col-start-1'))).toBe(
            true
        );
        expect(screen.getByRole('button', { name: 'Published' })).not.toHaveAttribute('aria-busy');
        expect(screen.getByRole('status')).toHaveTextContent('Published');
    });

    it('removes a loading link destination while preserving focusable link semantics', () => {
        render(Button, {
            props: {
                href: '/publish',
                status: 'loading',
                loadingLabel: 'Publishing…',
                children: textSnippet('Publish')
            }
        });
        const link = screen.getByRole('link', { name: 'Publishing…' });
        expect(link).not.toHaveAttribute('href');
        expect(link).toHaveAttribute('tabindex', '0');
        expect(link).toHaveAttribute('aria-disabled', 'true');
    });
});

describe('Button -- attribute spreading', () => {
    it('spreads aria-label onto the rendered element', () => {
        render(Button, {
            props: { 'aria-label': 'Close dialog', children: () => 'x' } as never
        });
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('spreads data-* attributes', () => {
        render(Button, {
            props: { 'data-testid': 'sivir-button', children: () => 'x' } as never
        });
        expect(screen.getByTestId('sivir-button')).toBeInTheDocument();
    });

    it('forwards class prop into the cn() merge', () => {
        render(Button, {
            props: { class: 'my-custom-class', children: () => 'x' } as never
        });
        const el = screen.getByRole('button');
        expect(el.className).toContain('my-custom-class');
    });
});

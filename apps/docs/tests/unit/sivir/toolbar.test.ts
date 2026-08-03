import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import Toolbar from '@sivir-ui/svelte/components/toolbar/toolbar.svelte';

describe('Toolbar', () => {
    it('renders a semantic toolbar', () => {
        const { container } = render(Toolbar);
        expect(container.querySelector('[role="toolbar"]')).toBeInTheDocument();
    });

    it('forwards HTML attributes', () => {
        const { container } = render(Toolbar, {
            props: { 'aria-label': 'Message actions', class: 'composer-actions' } as never
        });
        const toolbar = container.querySelector('[role="toolbar"]');
        expect(toolbar).toHaveAttribute('aria-label', 'Message actions');
        expect(toolbar?.className).toContain('composer-actions');
    });
});

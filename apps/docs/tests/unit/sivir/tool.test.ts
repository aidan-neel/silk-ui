import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ToolFixture from '../../fixtures/ToolFixture.svelte';

describe('Tool', () => {
    it('shows a spinner while running', () => {
        const { container } = render(ToolFixture, { props: { state: 'running' } });
        expect(container.querySelector('[data-ui="spinner"]')).toBeInTheDocument();
        expect(container.querySelector('.sivir-tool-running')).toHaveTextContent('Task running');
        expect(container.querySelector('[data-ui="tool"]')).toHaveAttribute('aria-busy', 'true');
    });

    it('keeps a stable full-width layout', () => {
        const { container } = render(ToolFixture, { props: { state: 'complete' } });
        expect(container.querySelector('[data-ui="tool"]')).toHaveClass('w-full', 'max-w-full');
    });

    it('removes the spinner once complete', () => {
        const { container } = render(ToolFixture, { props: { state: 'complete' } });
        expect(container.querySelector('[data-ui="spinner"]')).not.toBeInTheDocument();
        expect(container.querySelector('[data-ui="tool"]')).toHaveAttribute('aria-busy', 'false');
    });

    it('uses the quiet variant for low-emphasis transcript details', () => {
        const { container } = render(ToolFixture, {
            props: { state: 'complete', variant: 'quiet' }
        });
        expect(container.querySelector('[data-ui="tool"]')).toHaveAttribute(
            'data-variant',
            'quiet'
        );
        expect(container.querySelector('button')).toHaveClass('text-foreground', 'px-0');
    });
});

import { act, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import SkeletonSwapFixture from '../../fixtures/SkeletonSwapFixture.svelte';

describe('SkeletonSwap', () => {
    it('delays the placeholder and reserves the content box', async () => {
        vi.useFakeTimers();
        const { container } = render(SkeletonSwapFixture, { props: { ready: false } });
        const shell = container.querySelector('[data-ui="skeleton-swap"]')!;
        const placeholder = container.querySelector('.sivir-skeleton-placeholder')!;
        expect(shell).toHaveAttribute('aria-busy', 'true');
        expect(shell).toHaveStyle({ height: '42px' });
        expect(placeholder).toHaveAttribute('data-visible', 'false');

        await act(() => vi.advanceTimersByTime(20));
        expect(placeholder).toHaveAttribute('data-visible', 'true');
        vi.useRealTimers();
    });

    it('keeps a shown placeholder for its minimum visible time', async () => {
        vi.useFakeTimers();
        const view = render(SkeletonSwapFixture, { props: { ready: false } });
        await act(() => vi.advanceTimersByTime(20));
        await view.rerender({ ready: true });
        const shell = view.container.querySelector('[data-ui="skeleton-swap"]')!;
        const placeholder = view.container.querySelector('.sivir-skeleton-placeholder')!;
        expect(placeholder).toHaveAttribute('data-visible', 'true');
        expect(shell).toHaveAttribute('aria-busy', 'true');
        expect(view.container.querySelector('[role="status"]')).toHaveTextContent('');

        await act(() => vi.advanceTimersByTime(39));
        expect(placeholder).toHaveAttribute('data-visible', 'true');
        await act(() => vi.advanceTimersByTime(1));
        expect(placeholder).toHaveAttribute('data-visible', 'false');
        expect(shell).toHaveAttribute('aria-busy', 'false');
        expect(view.container.querySelector('[role="status"]')).toHaveTextContent('Profile loaded');
        vi.useRealTimers();
    });
});

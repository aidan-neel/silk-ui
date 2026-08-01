import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TaskStepsFixture from '../../fixtures/TaskStepsFixture.svelte';

describe('TaskSteps', () => {
    it('derives completed, active, and pending rows from the current index', () => {
        const { container } = render(TaskStepsFixture, { props: { current: 1 } });
        const rows = container.querySelectorAll('li');
        expect(rows[0]).toHaveAttribute('data-status', 'done');
        expect(rows[1]).toHaveAttribute('data-status', 'active');
        expect(rows[1]).toHaveAttribute('aria-current', 'step');
        expect(rows[2]).toHaveAttribute('data-status', 'pending');
        expect(screen.getByRole('list', { name: 'Deploy progress' })).toBeInTheDocument();
    });

    it('marks the current row as failed without completing later rows', () => {
        const { container } = render(TaskStepsFixture, { props: { current: 1, failed: true } });
        const rows = container.querySelectorAll('li');
        expect(rows[0]).toHaveAttribute('data-status', 'done');
        expect(rows[1]).toHaveAttribute('data-status', 'error');
        expect(rows[2]).toHaveAttribute('data-status', 'pending');
    });
});

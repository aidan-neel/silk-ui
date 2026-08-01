import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ReorderListFixture from '../../fixtures/ReorderListFixture.svelte';

describe('ReorderList', () => {
    it('does not commit a pointer click that never becomes a drag', async () => {
        render(ReorderListFixture);
        await userEvent.setup().click(screen.getByRole('button', { name: 'First' }));
        expect(screen.getByRole('status', { name: 'Commits' })).toHaveTextContent('0');
    });

    it('moves a grabbed row with the arrow keys and drops it with Space', async () => {
        render(ReorderListFixture);
        const user = userEvent.setup();
        const first = screen.getByRole('button', { name: 'First' });
        first.focus();
        await user.keyboard(' ');
        expect(first).toHaveAttribute('aria-pressed', 'true');
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('status', { name: 'Order' })).toHaveTextContent('two,one,three');
        await user.keyboard(' ');
        expect(first).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByRole('status', { name: 'Commits' })).toHaveTextContent('1');
    });

    it('restores the original order when Escape cancels a keyboard reorder', async () => {
        render(ReorderListFixture);
        const user = userEvent.setup();
        const second = screen.getByRole('button', { name: 'Second' });
        second.focus();
        await user.keyboard(' ');
        await user.keyboard('{ArrowDown}');
        expect(screen.getByRole('status', { name: 'Order' })).toHaveTextContent('one,three,two');
        await user.keyboard('{Escape}');
        expect(screen.getByRole('status', { name: 'Order' })).toHaveTextContent('one,two,three');
    });

    it('cancels an in-progress keyboard reorder when disabled', async () => {
        const { rerender } = render(ReorderListFixture, { disabled: false });
        const user = userEvent.setup();
        const first = screen.getByRole('button', { name: 'First' });
        first.focus();
        await user.keyboard(' ');
        await user.keyboard('{ArrowDown}');

        await rerender({ disabled: true });

        expect(screen.getByRole('status', { name: 'Order' })).toHaveTextContent('one,two,three');
        expect(first).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByRole('status', { name: 'Commits' })).toHaveTextContent('0');
    });
});

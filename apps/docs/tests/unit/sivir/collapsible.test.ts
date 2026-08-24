import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import CollapsibleFixture from '../../fixtures/CollapsibleFixture.svelte';
import { required } from '../../test-utils';

describe('Collapsible -- rendering', () => {
    it('renders the trigger always', () => {
        render(CollapsibleFixture, { props: { open: false } });
        expect(screen.getByTestId('collapsible-trigger')).toBeInTheDocument();
    });

    it('hides content when open=false', () => {
        render(CollapsibleFixture, { props: { open: false } });
        expect(screen.queryByTestId('collapsible-content')).not.toBeInTheDocument();
    });

    it('shows content when open=true initially', () => {
        render(CollapsibleFixture, { props: { open: true } });
        expect(screen.getByTestId('collapsible-content')).toBeInTheDocument();
    });
});

describe('Collapsible -- toggle interaction', () => {
    it('opens on trigger click', async () => {
        render(CollapsibleFixture, { props: { open: false } });
        expect(screen.queryByTestId('collapsible-content')).not.toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(screen.getByTestId('collapsible-trigger'));

        await waitFor(() => {
            expect(screen.getByTestId('collapsible-content')).toBeInTheDocument();
        });
    });

    it('clicking trigger updates the underlying state', async () => {
        render(CollapsibleFixture, { props: { open: false } });

        const user = userEvent.setup();
        await user.click(screen.getByTestId('collapsible-trigger'));

        expect(screen.getByRole('button', { name: 'Toggle' })).toHaveAttribute(
            'aria-expanded',
            'true'
        );
    });
});

describe('Collapsible -- disabled state', () => {
    it('disables the trigger when disabled=true', () => {
        render(CollapsibleFixture, { props: { open: false, disabled: true } });
        const button = required(screen.getByTestId('collapsible-trigger').closest('button'));
        expect(button).toBeDisabled();
    });
});

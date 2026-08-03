import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import ConversationFixture from '../../fixtures/ConversationFixture.svelte';

describe('Conversation', () => {
    it('exposes the transcript as a labelled polite log', () => {
        const { container } = render(ConversationFixture, {
            props: { label: 'Checkout incident conversation' }
        });
        const log = screen.getByRole('log', { name: 'Checkout incident conversation' });

        expect(log).toHaveAttribute('aria-live', 'polite');
        expect(log).toHaveAttribute('aria-relevant', 'additions text');
        expect(container.querySelector('[data-ui="conversation-transcript"]')).toContainElement(
            screen.getByText('Most recent response')
        );
    });

    it('renders the default empty-state guidance', () => {
        render(ConversationFixture, { props: { empty: true } });

        expect(screen.getByText('Start a conversation')).toBeInTheDocument();
        expect(
            screen.getByText('Ask a question or share what you are working on.')
        ).toBeInTheDocument();
    });

    it('makes the latest-message control reachable after following is paused', async () => {
        const { container } = render(ConversationFixture, { props: { follow: false } });
        const viewport = screen.getByRole('log');

        Object.defineProperties(viewport, {
            scrollHeight: { configurable: true, value: 1000 },
            clientHeight: { configurable: true, value: 200 }
        });
        viewport.scrollTop = 100;
        await fireEvent.wheel(viewport);
        await fireEvent.scroll(viewport);

        await waitFor(() => {
            const button = screen.getByRole('button', { name: 'Scroll to latest message' });
            expect(button).toBeEnabled();
            expect(button).not.toHaveAttribute('aria-hidden', 'true');
            expect(button).not.toHaveAttribute('tabindex', '-1');
        });
        expect(container.querySelector('[data-ui="conversation"]')).toHaveAttribute(
            'data-state',
            'paused'
        );
    });
});

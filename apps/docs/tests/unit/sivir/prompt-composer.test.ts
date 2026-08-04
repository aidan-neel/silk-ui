import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import PromptComposerFixture from '../../fixtures/PromptComposerFixture.svelte';
import { required } from '../../test-utils';

describe('PromptComposer', () => {
    it('binds typed input and submits it with Enter', async () => {
        render(PromptComposerFixture);
        const input = screen.getByRole('textbox', { name: 'Prompt' });
        const user = userEvent.setup();

        await user.type(input, 'Review the release{Enter}');

        expect(input).toHaveValue('Review the release');
        expect(screen.getByTestId('composer-value')).toHaveTextContent('Review the release');
        expect(screen.getByTestId('submit-count')).toHaveTextContent('1');
    });

    it('does not submit for Shift+Enter', async () => {
        render(PromptComposerFixture, { props: { value: 'First line' } });
        const input = screen.getByRole('textbox', { name: 'Prompt' });
        const user = userEvent.setup();
        input.focus();

        await user.keyboard('{Shift>}{Enter}{/Shift}');

        expect(screen.getByTestId('submit-count')).toHaveTextContent('0');
    });

    it('does not submit while an IME composition is active', async () => {
        render(PromptComposerFixture, { props: { value: '編集中' } });
        const input = screen.getByRole('textbox', { name: 'Prompt' });

        await fireEvent.compositionStart(input);
        await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        await fireEvent.compositionEnd(input);

        expect(screen.getByTestId('submit-count')).toHaveTextContent('0');
    });

    it('disables empty submission', async () => {
        render(PromptComposerFixture);
        const input = screen.getByRole('textbox', { name: 'Prompt' });

        expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
        await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        expect(screen.getByTestId('submit-count')).toHaveTextContent('0');
    });

    it('makes the input readonly and invokes Stop while submitting', async () => {
        render(PromptComposerFixture, { props: { value: 'Working', status: 'submitting' } });
        const input = screen.getByRole('textbox', { name: 'Prompt' });
        const stop = screen.getByRole('button', { name: 'Stop response' });

        expect(input).toHaveAttribute('readonly');
        expect(input).toHaveAttribute('aria-busy', 'true');
        await userEvent.setup().click(stop);
        expect(screen.getByTestId('stop-count')).toHaveTextContent('1');
    });

    it('shows the error alert above the composer', () => {
        render(PromptComposerFixture, { props: { status: 'error' } });

        const alert = screen.getByRole('alert');
        const composer = alert.parentElement?.parentElement;
        const form = composer?.querySelector('form');

        expect(alert).toHaveTextContent('Message could not be sent.');
        expect(alert).not.toHaveClass('blur-[4px]');
        expect(form).not.toBeNull();
        expect(alert.compareDocumentPosition(required(form))).toBe(
            Node.DOCUMENT_POSITION_FOLLOWING
        );
    });

    it('does not duplicate an unresolved async submission', async () => {
        render(PromptComposerFixture, { props: { value: 'Ship it', asyncSubmit: true } });
        const input = screen.getByRole('textbox', { name: 'Prompt' });

        await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        await waitFor(() => expect(input).toHaveAttribute('readonly'));
        await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(screen.getByTestId('submit-count')).toHaveTextContent('1');
        await userEvent.setup().click(screen.getByRole('button', { name: 'Resolve submission' }));
        await waitFor(() => expect(input).not.toHaveAttribute('readonly'));
    });
});

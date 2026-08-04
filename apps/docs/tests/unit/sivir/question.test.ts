import QuestionSubmit from '@sivir-ui/svelte/components/question/question-submit.svelte';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import type { Component } from 'svelte';
import { describe, expect, it } from 'vitest';
import QuestionFixture from '../../fixtures/QuestionFixture.svelte';
import QuestionTakeoverFixture from '../../fixtures/QuestionTakeoverFixture.svelte';
import { queryRequired, required } from '../../test-utils';

describe('Question', () => {
    it('submits one selected answer', async () => {
        render(QuestionFixture);
        const user = userEvent.setup();

        expect(screen.getByRole('button', { name: 'Submit answer' })).toBeEnabled();
        const option = screen.getByRole('radio', { name: /Safe rollout/ });
        expect(option).toBeRequired();
        await user.click(option);
        await user.click(screen.getByRole('button', { name: 'Submit answer' }));

        expect(screen.getByTestId('question-value')).toHaveTextContent('"safe"');
        expect(screen.getByTestId('submitted-answer')).toHaveTextContent('"safe"');
        expect(screen.getByTestId('submit-count')).toHaveTextContent('1');
        expect(screen.getByTestId('question-submit')).toHaveAttribute(
            'title',
            'Submit the current answer'
        );
    });

    it('toggles and submits multiple answers', async () => {
        render(QuestionFixture, { props: { type: 'multiple' } });
        const user = userEvent.setup();

        await user.click(screen.getByRole('checkbox', { name: /Safe rollout/ }));
        await user.click(screen.getByRole('checkbox', { name: /Manual handoff/ }));
        await user.click(screen.getByRole('button', { name: 'Submit answer' }));

        expect(screen.getByTestId('question-value')).toHaveTextContent('["safe","manual"]');
        expect(screen.getByTestId('submitted-answer')).toHaveTextContent('["safe","manual"]');
    });

    it('submits a free-text answer with Enter and keeps Shift+Enter for a new line', async () => {
        render(QuestionFixture, { props: { type: 'text' } });
        const user = userEvent.setup();
        const input = screen.getByRole('textbox', { name: 'Answer' });

        await user.type(input, 'Use the existing release plan');
        await user.keyboard('{Shift>}{Enter}{/Shift}');

        expect(input).toBeRequired();
        expect(new FormData(required(input.closest('form'))).get('answer')).toBe(
            'Use the existing release plan\n'
        );
        expect(screen.getByTestId('submit-count')).toHaveTextContent('0');
        await user.keyboard('{Enter}');
        expect(screen.getByTestId('submitted-answer')).toHaveTextContent(
            'Use the existing release plan'
        );
    });

    it('allows an optional empty answer', async () => {
        render(QuestionFixture, { props: { type: 'text', required: false } });

        await userEvent.setup().click(screen.getByRole('button', { name: 'Submit answer' }));

        expect(screen.getByTestId('submitted-answer')).toHaveTextContent('""');
    });

    it('shows required-answer validation and focuses the answer control', async () => {
        const view = render(QuestionFixture, { props: { type: 'multiple' } });

        await userEvent.setup().click(screen.getByRole('button', { name: 'Submit answer' }));

        const firstOption = screen.getByRole('checkbox', { name: /Safe rollout/ });
        const form = firstOption.closest('form');
        const visibleError = view.container.querySelector('[data-ui="question-error"]');

        expect(visibleError).toHaveTextContent('Select at least one answer.');
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Select at least one answer.');
        expect(firstOption).toHaveAttribute('aria-invalid', 'true');
        expect(firstOption).toHaveFocus();
        expect(form).toHaveAttribute('data-state', 'error');
        expect(view.container.querySelector('[data-ui="question-validation"]')).toBeNull();
        expect(screen.getByTestId('submit-count')).toHaveTextContent('0');
    });

    it('clears validation when a parent provides a valid answer', async () => {
        render(QuestionFixture, { props: { type: 'multiple' } });
        const user = userEvent.setup();

        await user.click(screen.getByRole('button', { name: 'Submit answer' }));
        await user.click(screen.getByRole('button', { name: 'Set valid answer' }));

        expect(screen.getByRole('status')).not.toHaveTextContent('Select at least one answer.');
        expect(screen.getByRole('checkbox', { name: /Safe rollout/ })).not.toHaveAttribute(
            'aria-invalid',
            'true'
        );
    });

    it('announces validation once when it replaces a submission error', async () => {
        const view = render(QuestionFixture, {
            props: {
                type: 'multiple',
                status: 'error'
            }
        });

        expect(screen.getByRole('alert')).toHaveTextContent('Answer could not be submitted.');
        await userEvent.setup().click(screen.getByRole('button', { name: 'Submit answer' }));

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Select at least one answer.');
        expect(view.container.querySelector('[data-ui="question-error"]')).toHaveTextContent(
            'Select at least one answer.'
        );
    });

    it('announces validation even when Actions is omitted', async () => {
        const view = render(QuestionFixture, { props: { showActions: false } });

        await fireEvent.submit(queryRequired(view.container, 'form'));

        expect(screen.getByRole('status')).toHaveTextContent('Select an answer.');
    });

    it('resets the bound answer when the question mode changes', async () => {
        render(QuestionFixture, { props: { value: 'safe' } });

        await userEvent.setup().click(screen.getByRole('button', { name: 'Change to multiple' }));

        expect(screen.getByTestId('question-value')).toHaveTextContent('[]');
        expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    });

    it('normalizes an incompatible parent value without a mode change', async () => {
        render(QuestionFixture, { props: { type: 'multiple', value: [] } });

        await userEvent
            .setup()
            .click(screen.getByRole('button', { name: 'Set incompatible answer' }));

        await waitFor(() => expect(screen.getByTestId('question-value')).toHaveTextContent('[]'));
    });

    it('invokes cancellation without submitting', async () => {
        render(QuestionFixture);

        await userEvent.setup().click(screen.getByRole('button', { name: 'Skip question' }));

        expect(screen.getByTestId('cancel-count')).toHaveTextContent('1');
        expect(screen.getByTestId('submit-count')).toHaveTextContent('0');
    });

    it('blocks duplicate async submissions', async () => {
        render(QuestionFixture, { props: { value: 'safe', asyncSubmit: true } });
        const submit = screen.getByRole('button', { name: 'Submit answer' });
        const form = submit.closest('form');

        submit.focus();
        const requiredForm = required(form);
        await fireEvent.submit(requiredForm);
        await fireEvent.submit(requiredForm);

        expect(screen.getByTestId('submit-count')).toHaveTextContent('1');
        expect(screen.getByTestId('submit-click-count')).toHaveTextContent('0');
        expect(submit).toHaveFocus();
        expect(submit).toHaveAttribute('aria-busy', 'true');
        await userEvent.setup().click(submit);
        expect(screen.getByTestId('submit-click-count')).toHaveTextContent('0');
        await userEvent.setup().click(screen.getByRole('button', { name: 'Resolve submission' }));
        await waitFor(() => expect(form).toHaveAttribute('aria-busy', 'false'));
    });

    it('shows an accessible error message', () => {
        render(QuestionFixture, { props: { status: 'error' } });

        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Answer could not be submitted.');
        expect(alert).not.toHaveClass('blur-[4px]');
    });

    it('can move focus to the first answer control', async () => {
        render(QuestionFixture, { props: { autofocus: true } });
        const firstOption = screen.getByRole('radio', { name: /Safe rollout/ });

        await waitFor(() => expect(firstOption).toHaveFocus());
    });

    it('waits to autofocus until an answer control is enabled', async () => {
        render(QuestionFixture, { props: { autofocus: true, disabled: true } });
        const firstOption = screen.getByRole('radio', { name: /Safe rollout/ });

        expect(firstOption).not.toHaveFocus();
        await userEvent.setup().click(screen.getByRole('button', { name: 'Enable question' }));
        await waitFor(() => expect(firstOption).toHaveFocus());
    });

    it('autofocuses an answer control added after mount', async () => {
        render(QuestionFixture, { props: { autofocus: true, delayed: true } });

        await userEvent.setup().click(screen.getByRole('button', { name: 'Reveal controls' }));

        await waitFor(() => {
            expect(screen.getByRole('radio', { name: /Safe rollout/ })).toHaveFocus();
        });
    });

    it('replaces the composer without losing its draft', async () => {
        render(QuestionTakeoverFixture);
        const user = userEvent.setup();

        expect(screen.queryByRole('textbox', { name: 'Prompt' })).not.toBeInTheDocument();
        await user.click(screen.getByRole('radio', { name: 'Preview' }));
        await user.click(screen.getByRole('button', { name: 'Submit answer' }));

        expect(screen.getByRole('textbox', { name: 'Prompt' })).toHaveValue('Keep this draft');
    });

    it('fails clearly when a child is rendered outside Root', () => {
        expect(() => render(QuestionSubmit as Component)).toThrow(
            'Question components must be used within <Question.Root>.'
        );
    });
});

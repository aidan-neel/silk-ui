import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import AccordionFixture from '../../fixtures/AccordionFixture.svelte';
import { required } from '../../test-utils';

describe('Accordion -- rendering', () => {
    it('renders one trigger per item', () => {
        render(AccordionFixture, { props: { type: 'single' } });
        expect(screen.getByTestId('trig-a')).toBeInTheDocument();
        expect(screen.getByTestId('trig-b')).toBeInTheDocument();
        expect(screen.getByTestId('trig-c')).toBeInTheDocument();
    });

    it('hides all content initially when no value is set', () => {
        render(AccordionFixture, { props: { type: 'single', value: undefined } });
        expect(screen.queryByTestId('content-a')).not.toBeInTheDocument();
        expect(screen.queryByTestId('content-b')).not.toBeInTheDocument();
    });

    it('shows content matching initial value (single mode)', () => {
        render(AccordionFixture, { props: { type: 'single', value: 'b' } });
        expect(screen.queryByTestId('content-a')).not.toBeInTheDocument();
        expect(screen.getByTestId('content-b')).toBeInTheDocument();
    });

    it('shows multiple content blocks for initial array value (multiple mode)', () => {
        render(AccordionFixture, { props: { type: 'multiple', value: ['a', 'b'] } });
        expect(screen.getByTestId('content-a')).toBeInTheDocument();
        expect(screen.getByTestId('content-b')).toBeInTheDocument();
        expect(screen.queryByTestId('content-c')).not.toBeInTheDocument();
    });
});

describe('Accordion -- single mode toggle', () => {
    it('opens the clicked item', async () => {
        render(AccordionFixture, { props: { type: 'single', value: undefined } });
        expect(screen.queryByTestId('content-a')).not.toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(screen.getByTestId('trig-a'));
        expect(screen.getByTestId('content-a')).toBeInTheDocument();
    });

    it('replaces the open item when clicking a different trigger', async () => {
        render(AccordionFixture, { props: { type: 'single', value: 'a' } });
        expect(screen.getByTestId('content-a')).toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(screen.getByTestId('trig-b'));
        await waitFor(() => {
            expect(screen.getByTestId('content-b')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.queryByTestId('content-a')).not.toBeInTheDocument();
        });
    });

    it('collapses on second click when collapsible=true', async () => {
        render(AccordionFixture, {
            props: { type: 'single', value: 'a', collapsible: true }
        });
        expect(screen.getByTestId('content-a')).toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(screen.getByTestId('trig-a'));
        await waitFor(() => {
            expect(screen.queryByTestId('content-a')).not.toBeInTheDocument();
        });
    });

    it('does not collapse on second click when collapsible=false', async () => {
        render(AccordionFixture, {
            props: { type: 'single', value: 'a', collapsible: false }
        });
        expect(screen.getByTestId('content-a')).toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(screen.getByTestId('trig-a'));
        expect(screen.getByTestId('content-a')).toBeInTheDocument();
    });
});

describe('Accordion -- multiple mode toggle', () => {
    it('opens multiple items independently', async () => {
        render(AccordionFixture, { props: { type: 'multiple', value: [] } });
        const user = userEvent.setup();

        await user.click(screen.getByTestId('trig-a'));
        await user.click(screen.getByTestId('trig-b'));

        expect(screen.getByTestId('content-a')).toBeInTheDocument();
        expect(screen.getByTestId('content-b')).toBeInTheDocument();
    });

    it('closes individual items on second click', async () => {
        render(AccordionFixture, { props: { type: 'multiple', value: ['a', 'b'] } });
        expect(screen.getByTestId('content-a')).toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(screen.getByTestId('trig-a'));
        await waitFor(() => {
            expect(screen.queryByTestId('content-a')).not.toBeInTheDocument();
        });
        expect(screen.getByTestId('content-b')).toBeInTheDocument();
    });
});

describe('Accordion -- ARIA', () => {
    it('trigger reflects aria-expanded matching open state', () => {
        render(AccordionFixture, { props: { type: 'single', value: 'a' } });
        const trigA = required(screen.getByTestId('trig-a').closest('button'));
        const trigB = required(screen.getByTestId('trig-b').closest('button'));
        expect(trigA.getAttribute('aria-expanded')).toBe('true');
        expect(trigB.getAttribute('aria-expanded')).toBe('false');
    });

    it('aria-controls points to a content element when the item is open', () => {
        render(AccordionFixture, { props: { type: 'single', value: 'a' } });
        const trigA = required(screen.getByTestId('trig-a').closest('button'));
        const ariaControls = trigA.getAttribute('aria-controls');
        expect(ariaControls).toBeTruthy();
        expect(document.getElementById(required(ariaControls))).toBeTruthy();
    });
});

describe('Accordion -- disabled items', () => {
    it('disables the trigger for items with disabled=true', () => {
        render(AccordionFixture, { props: { type: 'single' } });
        expect(screen.getByTestId('trig-c').closest('button')).toBeDisabled();
    });

    it('does not open a disabled item on click', async () => {
        render(AccordionFixture, { props: { type: 'single' } });

        const user = userEvent.setup();
        await user.click(screen.getByTestId('trig-c'));
        expect(screen.queryByTestId('content-c')).not.toBeInTheDocument();
    });
});

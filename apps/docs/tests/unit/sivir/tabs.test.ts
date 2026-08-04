import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import TabsFixture from '../../fixtures/TabsFixture.svelte';
import { queryRequired, required } from '../../test-utils';

describe('Tabs -- rendering', () => {
    it('renders one trigger per tab', () => {
        render(TabsFixture, { props: { value: 'one' } });
        expect(screen.getByTestId('trig-one')).toBeInTheDocument();
        expect(screen.getByTestId('trig-two')).toBeInTheDocument();
        expect(screen.getByTestId('trig-three')).toBeInTheDocument();
    });

    it('renders only the active tab content', () => {
        render(TabsFixture, { props: { value: 'one' } });
        expect(screen.getByTestId('content-one')).toBeInTheDocument();
        expect(screen.queryByTestId('content-two')).not.toBeInTheDocument();
        expect(screen.queryByTestId('content-three')).not.toBeInTheDocument();
    });

    it('marks the active trigger with aria-selected="true"', () => {
        render(TabsFixture, { props: { value: 'two' } });
        const triggerTwo = required(screen.getByTestId('trig-two').closest('button'));
        const triggerOne = required(screen.getByTestId('trig-one').closest('button'));
        expect(triggerTwo.getAttribute('aria-selected')).toBe('true');
        expect(triggerOne.getAttribute('aria-selected')).toBe('false');
    });
});

describe('Tabs -- interaction', () => {
    it('switches active content on trigger click', async () => {
        render(TabsFixture, { props: { value: 'one' } });
        expect(screen.getByTestId('content-one')).toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(screen.getByTestId('trig-two'));

        expect(screen.queryByTestId('content-one')).not.toBeInTheDocument();
        expect(screen.getByTestId('content-two')).toBeInTheDocument();
    });

    it('does not switch when a disabled trigger is clicked', async () => {
        render(TabsFixture, { props: { value: 'one' } });

        const user = userEvent.setup();
        await user.click(screen.getByTestId('trig-three'));

        expect(screen.getByTestId('content-one')).toBeInTheDocument();
        expect(screen.queryByTestId('content-three')).not.toBeInTheDocument();
    });

    it('exposes aria-controls linking triggers to content', () => {
        render(TabsFixture, { props: { value: 'one' } });
        const trigger = required(screen.getByTestId('trig-one').closest('button'));
        const ariaControls = trigger.getAttribute('aria-controls');
        expect(ariaControls).toBeTruthy();
        expect(document.getElementById(required(ariaControls))).toBeTruthy();
    });
});

describe('Tabs -- orientation', () => {
    it('exposes horizontal orientation by default', () => {
        const { container } = render(TabsFixture, { props: { value: 'one' } });
        const root = queryRequired(container, '[data-ui="tabs"]');
        const list = screen.getByRole('tablist');
        expect(root).toHaveAttribute('data-orientation', 'horizontal');
        expect(list).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('exposes vertical orientation on the root and tablist', () => {
        const { container } = render(TabsFixture, {
            props: { value: 'one', orientation: 'vertical' }
        });
        const root = queryRequired(container, '[data-ui="tabs"]');
        const list = screen.getByRole('tablist');
        expect(root).toHaveAttribute('data-orientation', 'vertical');
        expect(list).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('uses Down and Up Arrow to select tabs', async () => {
        render(TabsFixture, {
            props: { value: 'one', orientation: 'vertical' }
        });
        const user = userEvent.setup();
        const first = screen.getByRole('tab', { name: 'One' });
        const second = screen.getByRole('tab', { name: 'Two' });

        first.focus();
        await user.keyboard('{ArrowDown}');
        expect(second).toHaveFocus();
        expect(second).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByTestId('content-two')).toBeInTheDocument();

        await user.keyboard('{ArrowUp}');
        expect(first).toHaveFocus();
        expect(first).toHaveAttribute('aria-selected', 'true');
    });
});

describe('Tabs -- ARIA roles', () => {
    it('triggers use role="tab"', () => {
        render(TabsFixture, { props: { value: 'one' } });
        const tabs = document.querySelectorAll('[role="tab"]');
        expect(tabs.length).toBe(3);
    });

    it('content uses role="tabpanel"', () => {
        render(TabsFixture, { props: { value: 'one' } });
        const panel = document.querySelector('[role="tabpanel"]');
        expect(panel).toBeInTheDocument();
    });

    it('list uses role="tablist"', () => {
        render(TabsFixture, { props: { value: 'one' } });
        const list = document.querySelector('[role="tablist"]');
        expect(list).toBeInTheDocument();
    });
});

describe('Tabs -- variants', () => {
    it('defaults to the underline variant', () => {
        render(TabsFixture, { props: { value: 'one' } });
        const list = queryRequired(document, '[data-ui="tabs-list"]');
        expect(list.getAttribute('data-variant')).toBe('default');
    });

    it('segmented renders a muted track container', () => {
        render(TabsFixture, { props: { value: 'one', variant: 'segmented' } });
        const list = queryRequired(document, '[data-ui="tabs-list"]');
        expect(list.getAttribute('data-variant')).toBe('segmented');
        expect(list.className).toContain('bg-secondary');
    });

    it('segmented triggers render taller (min-height token) from first paint', () => {
        render(TabsFixture, { props: { value: 'one', variant: 'segmented' } });
        const trigger = queryRequired(document, '[role="tab"]');
        expect(trigger.className).toContain('min-h-[32px]');
    });

    it('ghost has no bordered container', () => {
        render(TabsFixture, { props: { value: 'one', variant: 'ghost' } });
        const list = queryRequired(document, '[data-ui="tabs-list"]');
        expect(list.getAttribute('data-variant')).toBe('ghost');
        expect(list.className).not.toContain('border-border');
    });

    it('default renders the tokenized underline as the active indicator', async () => {
        render(TabsFixture, { props: { value: 'one', variant: 'default' } });
        await waitFor(() => {
            const list = queryRequired(document, '[data-ui="tabs-list"]');
            const indicator = list.querySelector('div[aria-hidden="true"]');
            expect(indicator?.className).toContain('h-0.5');
        });
    });

    it('segmented renders an elevated pill as the active indicator', async () => {
        render(TabsFixture, { props: { value: 'one', variant: 'segmented' } });
        await waitFor(() => {
            const list = queryRequired(document, '[data-ui="tabs-list"]');
            const indicator = list.querySelector('div[aria-hidden="true"]');
            expect(indicator?.className).toContain('bg-card');
        });
    });

    it('ghost rests its fill on the selected tab', async () => {
        render(TabsFixture, { props: { value: 'one', variant: 'ghost' } });
        // the selected tab carries the ghost fill (a sliding highlight element)
        await waitFor(() => {
            const list = queryRequired(document, '[data-ui="tabs-list"]');
            const fill = list.querySelector('div[aria-hidden="true"]');
            expect(fill?.className).toContain('bg-secondary/70');
        });
        // and the active tab is still conveyed on the trigger itself
        const activeTrigger = required(screen.getByTestId('trig-one').closest('button'));
        expect(activeTrigger.getAttribute('aria-selected')).toBe('true');
        expect(activeTrigger.className).toContain('text-foreground');
    });
});

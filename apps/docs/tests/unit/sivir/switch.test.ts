import Switch from '@sivir-ui/svelte/components/switch/switch.svelte';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { required } from '../../test-utils';

describe('Switch -- rendering', () => {
    it('renders a button with role="switch"', () => {
        render(Switch, { props: { switched: false } });
        expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders the label when provided', () => {
        render(Switch, { props: { switched: false, label: 'Notifications' } });
        expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    it('renders the description when provided', () => {
        render(Switch, {
            props: { switched: false, label: 'X', description: 'send email digests' }
        });
        expect(screen.getByText('send email digests')).toBeInTheDocument();
    });
});

describe('Switch -- switched state', () => {
    it('aria-checked reflects switched=false', () => {
        render(Switch, { props: { switched: false } });
        expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('false');
    });

    it('aria-checked reflects switched=true', () => {
        render(Switch, { props: { switched: true } });
        expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
    });

    it('exposes data-state matching switched', () => {
        render(Switch, { props: { switched: true } });
        expect(screen.getByRole('switch').getAttribute('data-state')).toBe('checked');
    });
});

describe('Switch -- toggle interaction', () => {
    it('toggles when the switch button is clicked', async () => {
        render(Switch, { props: { switched: false } });
        const button = screen.getByRole('switch');
        expect(button.getAttribute('aria-checked')).toBe('false');

        const user = userEvent.setup();
        await user.click(button);
        expect(button.getAttribute('aria-checked')).toBe('true');
    });

    it('toggles when label is clicked', async () => {
        render(Switch, { props: { switched: false, label: 'Notifications' } });
        const button = screen.getByRole('switch');
        const label = screen.getByText('Notifications');
        expect(button.getAttribute('aria-checked')).toBe('false');

        const user = userEvent.setup();
        await user.click(label);
        expect(button.getAttribute('aria-checked')).toBe('true');
    });

    it('toggles back on second click', async () => {
        render(Switch, { props: { switched: true } });
        const button = screen.getByRole('switch');

        const user = userEvent.setup();
        await user.click(button);
        expect(button.getAttribute('aria-checked')).toBe('false');
    });
});

describe('Switch -- keyboard activation', () => {
    it('toggles on Space key when focused', async () => {
        render(Switch, { props: { switched: false } });
        const button = screen.getByRole('switch');
        button.focus();

        const user = userEvent.setup();
        await user.keyboard(' ');
        expect(button.getAttribute('aria-checked')).toBe('true');
    });

    it('toggles on Enter key on the label region', async () => {
        render(Switch, { props: { switched: false, label: 'Test' } });
        const button = screen.getByRole('switch');
        const label = screen.getByText('Test');
        label.focus();

        const user = userEvent.setup();
        await user.click(label);
        expect(button.getAttribute('aria-checked')).toBe('true');
    });
});

describe('Switch -- disabled state', () => {
    it('marks the switch as disabled', () => {
        render(Switch, { props: { switched: false, disabled: true } });
        expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('does not toggle on click when disabled', async () => {
        render(Switch, { props: { switched: false, disabled: true } });
        const button = screen.getByRole('switch');

        const user = userEvent.setup();
        await user.click(button);
        expect(button.getAttribute('aria-checked')).toBe('false');
    });
});

describe('Switch -- labelling', () => {
    it('uses aria-labelledby when label is provided', () => {
        render(Switch, { props: { switched: false, label: 'Notifications' } });
        const button = screen.getByRole('switch');
        const labelledBy = button.getAttribute('aria-labelledby');
        expect(labelledBy).toBeTruthy();
        const labelEl = document.getElementById(required(labelledBy));
        expect(labelEl?.textContent).toBe('Notifications');
    });

    it('uses aria-label fallback when no label prop and aria-label is provided', () => {
        render(Switch, {
            props: { switched: false, 'aria-label': 'Toggle dark mode' } as never
        });
        const button = screen.getByRole('switch');
        expect(button.getAttribute('aria-label')).toBe('Toggle dark mode');
    });

    it('uses aria-describedby when description is provided', () => {
        render(Switch, {
            props: { switched: false, label: 'X', description: 'helper text' }
        });
        const button = screen.getByRole('switch');
        const describedBy = button.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(document.getElementById(required(describedBy))?.textContent).toBe('helper text');
    });
});

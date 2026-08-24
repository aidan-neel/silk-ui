import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ToggleGroupFixture from '../../fixtures/ToggleGroupFixture.svelte';
import { required } from '../../test-utils';

describe('ToggleGroup -- rendering', () => {
    it('renders one button per item', () => {
        const { container } = render(ToggleGroupFixture, {
            props: { type: 'single', value: '' }
        });
        const buttons = container.querySelectorAll('button');
        expect(buttons.length).toBe(3);
        expect(container.querySelectorAll('.sivir-item-highlight')).toHaveLength(1);
    });
});

describe('ToggleGroup -- single mode', () => {
    it('marks the initial value as active', () => {
        const { container } = render(ToggleGroupFixture, {
            props: { type: 'single', value: 'italic' }
        });
        const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('button'));
        const italic = required(buttons.find((button) => button.textContent === 'I'));
        const bold = required(buttons.find((button) => button.textContent === 'B'));
        expect(italic.getAttribute('aria-pressed')).toBe('true');
        expect(bold.getAttribute('aria-pressed')).toBe('false');
    });

    it('replaces the active item on click', async () => {
        const { container } = render(ToggleGroupFixture, {
            props: { type: 'single', value: 'bold' }
        });
        const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('button'));
        const bold = required(buttons.find((button) => button.textContent === 'B'));
        const underline = required(buttons.find((button) => button.textContent === 'U'));

        const user = userEvent.setup();
        await user.click(underline);
        expect(underline.getAttribute('aria-pressed')).toBe('true');
        expect(bold.getAttribute('aria-pressed')).toBe('false');
    });

    it('exactly one item is active at a time after interactions', async () => {
        const { container } = render(ToggleGroupFixture, {
            props: { type: 'single', value: '' }
        });
        const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('button'));
        const user = userEvent.setup();
        await user.click(buttons[0]);
        await user.click(buttons[1]);
        await user.click(buttons[2]);

        const active = buttons.filter((b) => b.getAttribute('aria-pressed') === 'true');
        expect(active.length).toBe(1);
        expect(active[0].textContent).toBe('U');
    });
});

describe('ToggleGroup -- multiple mode', () => {
    it('marks all initial array values as active', () => {
        const { container } = render(ToggleGroupFixture, {
            props: { type: 'multiple', value: ['bold', 'italic'] }
        });
        const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('button'));
        const bold = required(buttons.find((button) => button.textContent === 'B'));
        const italic = required(buttons.find((button) => button.textContent === 'I'));
        const underline = required(buttons.find((button) => button.textContent === 'U'));
        expect(bold.getAttribute('aria-pressed')).toBe('true');
        expect(italic.getAttribute('aria-pressed')).toBe('true');
        expect(underline.getAttribute('aria-pressed')).toBe('false');
    });

    it('toggles items independently', async () => {
        const { container } = render(ToggleGroupFixture, {
            props: { type: 'multiple', value: [] }
        });
        const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('button'));
        const user = userEvent.setup();
        await user.click(buttons[0]); // bold on
        await user.click(buttons[2]); // underline on

        expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
        expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
        expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
    });

    it('clicking an active item removes it from the selection', async () => {
        const { container } = render(ToggleGroupFixture, {
            props: { type: 'multiple', value: ['bold'] }
        });
        const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('button'));
        const bold = required(buttons.find((button) => button.textContent === 'B'));
        expect(bold.getAttribute('aria-pressed')).toBe('true');

        const user = userEvent.setup();
        await user.click(bold);
        expect(bold.getAttribute('aria-pressed')).toBe('false');
    });
});

describe('ToggleGroup -- disabled state', () => {
    it('disables all items when group is disabled', () => {
        const { container } = render(ToggleGroupFixture, {
            props: { type: 'single', value: '', disabled: true }
        });
        const buttons = container.querySelectorAll('button');
        for (const button of buttons) {
            expect(button).toBeDisabled();
        }
    });
});

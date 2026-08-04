import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import RadioGroupFixture from '../../fixtures/RadioGroupFixture.svelte';
import { queryRequired } from '../../test-utils';

describe('RadioGroup -- rendering', () => {
    it('renders one radio input per item', () => {
        const { container } = render(RadioGroupFixture, { props: { value: '' } });
        const inputs = container.querySelectorAll('input[type="radio"]');
        expect(inputs.length).toBe(3);
    });

    it('all inputs share the same name', () => {
        const { container } = render(RadioGroupFixture, {
            props: { value: '', name: 'fruits' }
        });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        const names = Array.from(inputs).map((i) => i.name);
        expect(new Set(names).size).toBe(1);
        expect(names[0]).toBe('fruits');
    });

    it('renders labels for each item', () => {
        render(RadioGroupFixture, { props: { value: '' } });
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
        expect(screen.getByText('Cherry')).toBeInTheDocument();
    });
});

describe('RadioGroup -- initial selection', () => {
    it('marks the matching value as checked on initial render', () => {
        const { container } = render(RadioGroupFixture, { props: { value: 'banana' } });
        const banana = container.querySelector<HTMLInputElement>('input[value="banana"]');
        expect(banana?.checked).toBe(true);
    });

    it('leaves all inputs unchecked when value is empty', () => {
        const { container } = render(RadioGroupFixture, { props: { value: '' } });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        for (const input of inputs) {
            expect(input.checked).toBe(false);
        }
    });

    it('only one input is checked at a time', () => {
        const { container } = render(RadioGroupFixture, { props: { value: 'cherry' } });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        const checked = Array.from(inputs).filter((i) => i.checked);
        expect(checked.length).toBe(1);
        expect(checked[0].value).toBe('cherry');
    });
});

describe('RadioGroup -- selection interaction', () => {
    it('changes selection when a different item is clicked', async () => {
        const { container } = render(RadioGroupFixture, { props: { value: 'apple' } });
        const banana = queryRequired<HTMLInputElement>(container, 'input[value="banana"]');
        const apple = queryRequired<HTMLInputElement>(container, 'input[value="apple"]');

        expect(apple.checked).toBe(true);

        const user = userEvent.setup();
        await user.click(banana);
        expect(banana.checked).toBe(true);
        expect(apple.checked).toBe(false);
    });
});

describe('RadioGroup -- disabled state', () => {
    it('disables all items when group is disabled', () => {
        const { container } = render(RadioGroupFixture, {
            props: { value: '', disabled: true }
        });
        const inputs = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
        for (const input of inputs) {
            expect(input).toBeDisabled();
        }
    });
});

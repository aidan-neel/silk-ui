import { cleanup, render } from '@testing-library/svelte';
import type { Component } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CollapsibleTrigger from '@sivir-ui/svelte/components/collapsible/collapsible-trigger.svelte';
import ComboboxTrigger from '@sivir-ui/svelte/components/combobox/combobox-trigger.svelte';
import ContextMenuContent from '@sivir-ui/svelte/components/context-menu/context-menu-content.svelte';
import DropdownMenuContent from '@sivir-ui/svelte/components/dropdown-menu/dropdown-menu-content.svelte';
import PopoverTrigger from '@sivir-ui/svelte/components/popover/popover-trigger.svelte';
import SelectTrigger from '@sivir-ui/svelte/components/select/select-trigger.svelte';
import SheetTrigger from '@sivir-ui/svelte/components/sheet/sheet-trigger.svelte';
import { clickOutside } from '@sivir-ui/svelte/utils';
import CollapsibleFixture from '../../fixtures/CollapsibleFixture.svelte';

afterEach(() => {
    cleanup();
    vi.useRealTimers();
});

describe('Compound component context boundaries', () => {
    it.each([
        [
            'Collapsible',
            CollapsibleTrigger,
            'Collapsible components must be used within <Collapsible.Root>.'
        ],
        ['Combobox', ComboboxTrigger, 'Combobox components must be used within <Combobox.Root>.'],
        [
            'ContextMenu',
            ContextMenuContent,
            'ContextMenu components must be used within <ContextMenu.Root>.'
        ],
        [
            'DropdownMenu',
            DropdownMenuContent,
            'DropdownMenu components must be used within <DropdownMenu.Root>.'
        ],
        ['Popover', PopoverTrigger, 'Popover components must be used within <Popover.Root>.'],
        ['Select', SelectTrigger, 'Select components must be used within <Select.Root>.'],
        ['Sheet', SheetTrigger, 'Sheet components must be used within <Sheet.Root>.']
    ])('%s child fails clearly outside its root', (_name, component, message) => {
        expect(() => render(component as Component)).toThrow(message);
    });
});

describe('Scoped lifecycle cleanup', () => {
    it('supports repeated mount and unmount without retained component state', () => {
        for (let index = 0; index < 25; index += 1) {
            const view = render(CollapsibleFixture, { open: index % 2 === 0 });
            expect(view.container.querySelector('[data-ui="collapsible-trigger"]')).toHaveAttribute(
                'aria-expanded',
                String(index % 2 === 0)
            );
            view.unmount();
            expect(view.container).toBeEmptyDOMElement();
        }
    });

    it('never installs a click-outside listener after immediate destroy', () => {
        vi.useFakeTimers();
        const addListener = vi.spyOn(document, 'addEventListener');
        const node = document.createElement('div');
        const action = clickOutside(node, vi.fn());

        action.destroy();
        vi.runAllTimers();

        expect(addListener).not.toHaveBeenCalledWith('click', expect.any(Function));
        addListener.mockRestore();
    });
});

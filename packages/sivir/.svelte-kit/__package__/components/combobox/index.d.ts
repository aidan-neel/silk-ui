import type { PopoverProps } from '@sivir-ui/svelte/components/popover';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './combobox.svelte';
import Content from './combobox-content.svelte';
import Item from './combobox-item.svelte';
import Label from './combobox-label.svelte';
import Results from './combobox-results.svelte';
import Trigger from './combobox-trigger.svelte';
export type ComboboxItem = {
    id: string;
    value: string;
    label: string;
    callback?: () => void;
    ref: HTMLButtonElement | HTMLAnchorElement | undefined;
};
export type ComboboxState = {
    open: boolean;
    items: Set<ComboboxItem>;
    results: Set<ComboboxItem>;
    searchContent: string;
    searchPlacement: 'trigger' | 'menu';
    threshold: number;
    activeValue?: string;
    selected?: ComboboxItem;
};
export type ComboboxRootProps = PopoverProps & {
    value?: string;
    onValueChange?: (value: string) => void;
};
export type ComboboxTriggerProps = {
    class?: string;
    placeholder?: string;
    searchPlacement?: 'trigger' | 'menu';
    threshold?: number;
} & DefaultProps;
export { Content, Item, Label, Results, Root, Trigger };

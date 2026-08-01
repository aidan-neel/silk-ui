import Root from './combobox.svelte';
import Content from './combobox-content.svelte';
import Trigger from './combobox-trigger.svelte';
import Results from './combobox-results.svelte';
import Item from './combobox-item.svelte';
import Label from './combobox-label.svelte';
import type { DefaultProps } from '@sivir-ui/svelte/utils';

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
    activeValue?: string;
    selected?: ComboboxItem;
};

export type ComboboxRootProps = {
    placeholder?: string;
} & DefaultProps;

export type ComboboxTriggerProps = {
    class?: string;
    threshold?: number;
} & DefaultProps;

export { Root, Content, Trigger, Results, Item, Label };

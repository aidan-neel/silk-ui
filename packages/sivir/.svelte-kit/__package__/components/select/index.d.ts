import type { ButtonProps } from '@sivir-ui/svelte/components/button';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import Root from './select.svelte';
import Content from './select-content.svelte';
import Item from './select-item.svelte';
import Label from './select-label.svelte';
import Trigger from './select-trigger.svelte';
import Value from './select-value.svelte';
export type SelectState = {
    value: string;
    selectedLabel: string;
};
export type SelectProps = {
    value?: string;
    open?: boolean;
    onValueChange?: (value: string) => void;
    onOpenChange?: (open: boolean) => void;
    children?: Snippet;
};
export type SelectItemProps = {
    value: string;
    label?: string;
    children?: Snippet;
} & ButtonProps;
export type SelectValueProps = {
    placeholder?: string;
} & DefaultProps;
export { Content, Item, Label, Root, Trigger, Value };

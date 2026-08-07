import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './radio-group.svelte';
import Item from './radio-group-item.svelte';
export type RadioGroupProps = {
    value?: string;
    name?: string;
    disabled?: boolean;
    onValueChange?: (value: string) => void;
    children?: Snippet;
} & DefaultProps;
export type RadioGroupItemProps = {
    value: string;
    disabled?: boolean;
    label?: string;
    description?: string;
    id?: string;
} & DefaultProps &
    Omit<HTMLInputAttributes, 'type' | 'value' | 'name' | 'checked'>;
export type RadioGroupContext = {
    readonly name: string | undefined;
    readonly disabled: boolean;
    isSelected: (value: string) => boolean;
    setValue: (value: string) => void;
};
export { Root, Item };

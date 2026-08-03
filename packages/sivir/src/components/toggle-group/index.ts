import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './toggle-group.svelte';
import Item from './toggle-group-item.svelte';

export type ToggleGroupProps = {
    type?: 'single' | 'multiple';
    value?: string | string[];
    disabled?: boolean;
    onValueChange?: (value: string | string[] | undefined) => void;
    children?: Snippet;
} & DefaultProps;

export type ToggleGroupItemProps = {
    value: string;
    disabled?: boolean;
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLButtonAttributes, 'onclick' | 'children' | 'disabled' | 'value'>;

export type ToggleGroupContext = {
    readonly disabled: boolean;
    readonly type: 'single' | 'multiple';
    isActive: (value: string) => boolean;
    setValue: (value: string) => void;
};

export { Root, Item };

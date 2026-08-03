import Root from './dropdown-menu.svelte';
import Trigger from './dropdown-menu-trigger.svelte';
import Label from './dropdown-menu-label.svelte';
import Item from './dropdown-menu-item.svelte';
import Content from './dropdown-menu-content.svelte';
import Separator from './dropdown-menu-separator.svelte';
import Sub from './dropdown-menu-sub.svelte';
import SubContent from './dropdown-menu-sub-content.svelte';
import SubTrigger from './dropdown-menu-sub-trigger.svelte';
import RadioGroup from './dropdown-menu-radio-group.svelte';
import RadioItem from './dropdown-menu-radio-item.svelte';
import CheckboxItem from './dropdown-menu-checkbox-item.svelte';
import type { Snippet } from 'svelte';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type DropdownMenuRadioGroupProps = {
    value?: string;
    onValueChange?: (value: string) => void;
    children?: Snippet;
};

export type DropdownMenuRadioItemProps = {
    value: string;
    children?: Snippet;
    element?: HTMLButtonElement | HTMLAnchorElement;
} & DefaultProps &
    Omit<HTMLButtonAttributes, 'children' | 'role' | 'aria-checked'>;

export type DropdownMenuCheckboxItemProps = {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    children?: Snippet;
    element?: HTMLButtonElement | HTMLAnchorElement;
} & DefaultProps &
    Omit<HTMLButtonAttributes, 'children' | 'role' | 'aria-checked'>;

export {
    Root,
    Trigger,
    Label,
    Item,
    Content,
    Separator,
    Sub,
    SubContent,
    SubTrigger,
    RadioGroup,
    RadioItem,
    CheckboxItem
};

import type { ButtonProps } from '@sivir-ui/svelte/components/button';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import Root from './dropdown-menu.svelte';
import CheckboxItem from './dropdown-menu-checkbox-item.svelte';
import Content from './dropdown-menu-content.svelte';
import Item from './dropdown-menu-item.svelte';
import Label from './dropdown-menu-label.svelte';
import RadioGroup from './dropdown-menu-radio-group.svelte';
import RadioItem from './dropdown-menu-radio-item.svelte';
import Separator from './dropdown-menu-separator.svelte';
import Sub from './dropdown-menu-sub.svelte';
import SubContent from './dropdown-menu-sub-content.svelte';
import SubTrigger from './dropdown-menu-sub-trigger.svelte';
import Trigger from './dropdown-menu-trigger.svelte';

export type DropdownMenuProps = {
    inverted?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: Snippet;
};

export type DropdownMenuItemProps = {
    callback?: () => void;
} & ButtonProps;

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
    CheckboxItem,
    Content,
    Item,
    Label,
    RadioGroup,
    RadioItem,
    Root,
    Separator,
    Sub,
    SubContent,
    SubTrigger,
    Trigger
};

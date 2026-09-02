import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import Root from './command.svelte';
import Content from './command-content.svelte';
import Group from './command-group.svelte';
import Item from './command-item.svelte';
import Results from './command-results.svelte';
import Search from './command-search.svelte';
import Separator from './command-separator.svelte';
import Trigger from './command-trigger.svelte';
export type CommandItem = {
    id: string;
    name: string;
    callback: (() => void) | undefined;
    ref: HTMLButtonElement | HTMLAnchorElement | undefined;
    disabled: boolean;
};
export type CommandProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: Snippet;
};
export type CommandItemProps = {
    name?: string;
    value?: string;
    callback?: () => void;
    disabled?: boolean;
    href?: string;
    onclick?: () => void;
} & DefaultProps;
export type CommandState = {
    id: string;
    items: CommandItem[];
    results: CommandItem[];
    searchContent: string;
    activeId: string | undefined;
    itemsVersion: number;
};
export { Content, Group, Item, Results, Root, Search, Separator, Trigger };

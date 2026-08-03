import Root from './command.svelte';
import Content from './command-content.svelte';
import Trigger from './command-trigger.svelte';
import Separator from './command-separator.svelte';
import Results from './command-results.svelte';
import Search from './command-search.svelte';
import Item from './command-item.svelte';
import Group from './command-group.svelte';

export type CommandItem = {
    id: string;
    name: string;
    callback: (() => void) | undefined;
    ref: HTMLButtonElement | HTMLAnchorElement | undefined;
    disabled: boolean;
};

export type CommandState = {
    id: string;
    items: CommandItem[];
    results: CommandItem[];
    searchContent: string;
    activeId: string | undefined;
    itemsVersion: number;
};

export { Root, Content, Trigger, Separator, Results, Search, Item, Group };

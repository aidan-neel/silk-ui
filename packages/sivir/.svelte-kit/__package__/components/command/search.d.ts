import type { CommandItem } from './index';
export declare const DEFAULT_COMMAND_SEARCH_THRESHOLD = 0.2;
export declare function searchCommandItems(
    items: CommandItem[],
    query: string,
    threshold?: number
): CommandItem[];

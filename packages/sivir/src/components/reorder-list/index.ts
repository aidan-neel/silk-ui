import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import ReorderList from './reorder-list.svelte';

export type ReorderListProps<T> = {
    items: T[];
    getId: (item: T) => string;
    getLabel: (item: T) => string;
    children: Snippet<[T]>;
    label: string;
    disabled?: boolean;
    onReorder?: (items: T[]) => void;
    onCommit?: (items: T[]) => void;
    class?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export { ReorderList };
export default ReorderList;

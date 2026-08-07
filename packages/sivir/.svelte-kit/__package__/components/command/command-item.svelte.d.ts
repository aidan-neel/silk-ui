import { type Snippet } from 'svelte';
import type { CommandItem } from '.';
type Props = {
    class?: string;
    name: string;
    children?: Snippet;
    callback?: () => void;
    disabled?: boolean;
    href?: string;
    onclick?: () => void;
};
declare const CommandItem: import("svelte").Component<Props, {}, "">;
type CommandItem = ReturnType<typeof CommandItem>;
export default CommandItem;

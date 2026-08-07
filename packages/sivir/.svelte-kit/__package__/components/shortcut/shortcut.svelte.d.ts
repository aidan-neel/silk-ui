import { type Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    children?: Snippet;
    shortcut: string;
    ontrigger?: (event: KeyboardEvent) => void;
};
declare const Shortcut: import('svelte').Component<Props, {}, ''>;
type Shortcut = ReturnType<typeof Shortcut>;
export default Shortcut;

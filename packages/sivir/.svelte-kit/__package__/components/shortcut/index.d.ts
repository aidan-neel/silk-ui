import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import Shortcut from './shortcut.svelte';
export type ShortcutProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
    children?: Snippet;
    shortcut: string;
    ontrigger?: (event: KeyboardEvent) => void;
};
export { Shortcut };
export default Shortcut;

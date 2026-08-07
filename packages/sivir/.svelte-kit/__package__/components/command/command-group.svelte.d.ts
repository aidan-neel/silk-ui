import type { Snippet } from 'svelte';
type Props = {
    children: Snippet;
    class?: string;
    heading: string;
};
declare const CommandGroup: import("svelte").Component<Props, {}, "">;
type CommandGroup = ReturnType<typeof CommandGroup>;
export default CommandGroup;

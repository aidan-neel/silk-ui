import type { Snippet } from 'svelte';
type Props = {
    children?: Snippet;
    class?: string;
    allowClickOutside?: boolean;
    label?: string;
};
declare const CommandContent: import('svelte').Component<Props, {}, ''>;
type CommandContent = ReturnType<typeof CommandContent>;
export default CommandContent;

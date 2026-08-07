import { type Snippet } from 'svelte';
type $$ComponentProps = {
    children?: Snippet;
    class?: string;
    /** Also reveal the tooltip on click (e.g. Copy buttons fired by touch/keyboard). */
    showOnClick?: boolean;
};
declare const TooltipTrigger: import('svelte').Component<$$ComponentProps, {}, ''>;
type TooltipTrigger = ReturnType<typeof TooltipTrigger>;
export default TooltipTrigger;

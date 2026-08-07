import { type Snippet } from 'svelte';
type Placement = 'top' | 'left' | 'bottom' | 'right';
type $$ComponentProps = {
    children?: Snippet;
    delay?: number;
    closeDelay?: number;
    placement?: Placement;
};
declare const Tooltip: import('svelte').Component<$$ComponentProps, {}, ''>;
type Tooltip = ReturnType<typeof Tooltip>;
export default Tooltip;

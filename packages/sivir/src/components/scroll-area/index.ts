import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import ScrollArea from './scroll-area.svelte';

export type ScrollAreaProps = {
    orientation?: 'vertical' | 'horizontal' | 'both';
    showCues?: boolean;
    children?: Snippet;
    element?: HTMLDivElement;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;

export { ScrollArea };
export default ScrollArea;

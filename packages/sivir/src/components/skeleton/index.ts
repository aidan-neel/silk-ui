import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import Skeleton from './skeleton.svelte';
import SkeletonSwap from './skeleton-swap.svelte';

export type SkeletonProps = {
    children?: Snippet;
    class?: string;
    w?: number;
    h?: number;
    unit?:
        | 'px'
        | 'rem'
        | 'em'
        | '%'
        | 'vh'
        | 'vw'
        | 'vmin'
        | 'vmax'
        | 'ch'
        | 'ex'
        | 'cm'
        | 'mm'
        | 'in'
        | 'pt'
        | 'pc';
};

export type SkeletonSwapProps = {
    ready: boolean;
    children?: Snippet;
    skeleton?: Snippet;
    lines?: number;
    lineHeight?: number;
    barHeight?: number;
    reserve?: number;
    delay?: number;
    minVisible?: number;
    label?: string;
    class?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export { Skeleton, SkeletonSwap };

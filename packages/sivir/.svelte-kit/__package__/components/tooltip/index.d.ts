import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import Root from './tooltip.svelte';
import Content from './tooltip-content.svelte';
import Trigger from './tooltip-trigger.svelte';
export type TooltipPlacement = 'top' | 'left' | 'bottom' | 'right';
export type TooltipProps = {
    delay?: number;
    closeDelay?: number;
    placement?: TooltipPlacement;
    children?: Snippet;
};
export type TooltipTriggerProps = {
    showOnClick?: boolean;
} & DefaultProps;
export type TooltipContentProps = DefaultProps;
export type TooltipState = {
    text: string;
    placement: TooltipPlacement;
    delay: number;
    closeDelay: number;
    className: string;
};
export { Content, Root, Trigger };

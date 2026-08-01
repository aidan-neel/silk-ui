import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';
import type { ButtonProps } from '@sivir-ui/svelte/components/button';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './fullscreen-nav.svelte';
import Trigger from './fullscreen-nav-trigger.svelte';
import Content from './fullscreen-nav-content.svelte';
import Close from './fullscreen-nav-close.svelte';
import Group from './fullscreen-nav-group.svelte';
import Link from './fullscreen-nav-link.svelte';

export type FullscreenNavProps = {
    open?: boolean;
    children?: Snippet;
};

export type FullscreenNavTriggerProps = ButtonProps;
export type FullscreenNavContentProps = {
    label?: string;
} & DefaultProps;
export type FullscreenNavCloseProps = ButtonProps;
export type FullscreenNavGroupProps = {
    heading: string;
} & DefaultProps;
export type FullscreenNavLinkProps = Omit<HTMLAnchorAttributes, 'class' | 'children'> & {
    class?: string;
    children?: Snippet;
};

export type FullscreenNavState = {
    open: boolean;
    animationIndex: number;
    triggerRef?: HTMLElement | null;
};

export { Root, Trigger, Content, Close, Group, Link };

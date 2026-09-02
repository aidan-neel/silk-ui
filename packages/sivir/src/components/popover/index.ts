import type { VirtualElement } from '@floating-ui/dom';
import type { ButtonVariant } from '@sivir-ui/svelte/components/button';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import Root from './popover.svelte';
import Content from './popover-content.svelte';
import Title from './popover-title.svelte';
import Trigger from './popover-trigger.svelte';

export type PopoverContentProps = {
    children: Snippet;
    class?: string;
    /** Classes for the inset surface (where children live) — padding, layout,
     * background overrides. The `class` prop styles the outer Panel frame. */
    surfaceClass?: string;
    allowClickOutside?: boolean;
    portal?: boolean;
    refElement?: VirtualElement;
    role?: 'dialog' | 'alertdialog' | 'menu' | 'listbox' | 'none';
    tabindex?: number;
    /** Trap Tab focus inside the panel while open. Defaults to `true`. */
    focusTrap?: boolean;
    /** Lock document scrolling while the panel is open. Defaults to `true`. */
    lockScroll?: boolean;
} & DefaultProps &
    Partial<HTMLAttributes<HTMLElement>>;

export type PopoverProps = {
    children?: Snippet;
    open?: boolean;
    placement?: Placement;
    /** Stable identifier used to connect trigger and content ARIA attributes. */
    state_key?: string;
    hoverable?: boolean;
    delay?: number;
    closeDelay?: number;
    /** Make document content outside an open non-hover popover inert. Defaults to `true`. */
    inert?: boolean;
};

export type PopoverTriggerProps = {
    icon?: boolean;
    variant?: ButtonVariant;
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children?: Snippet;
    class?: string;
    element?: HTMLButtonElement | HTMLAnchorElement | undefined;
    /** Forwarded to Button: render with `class` alone, skipping variant/size. */
    unstyled?: boolean;
    onclick?: () => void;
    /** Called immediately before this trigger opens its popover. */
    onopen?: () => void;
    style?: string;
} & Pick<
    HTMLButtonAttributes,
    | 'disabled'
    | 'type'
    | 'name'
    | 'value'
    | 'id'
    | 'role'
    | 'tabindex'
    | 'aria-label'
    | 'aria-controls'
    | 'aria-expanded'
    | 'aria-haspopup'
> &
    Partial<Record<`data-${string}`, string | boolean | null>>;
export type PopoverTitleProps = DefaultProps;

/** Mirrors floating-ui's placements: a side, optionally aligned to a corner. */
export type Placement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

export type PopoverState = {
    open: boolean;
    focusedInside?: boolean;
    trigger: HTMLElement | null;
    focusedElement: HTMLElement | null;
    buttonRef: HTMLElement | null;
    popoverRef: HTMLElement | undefined;
    placement: Placement;
    onclick: (() => void) | undefined;
    closeTimeout: ReturnType<typeof setTimeout> | undefined;
    hoverTimeout?: ReturnType<typeof setTimeout> | undefined;
    hoverable: boolean;
    hovering?: boolean;
    delay: number | undefined;
    closeDelay: number | undefined;
    inert: boolean;
};

export { Content, Root, Title, Trigger };

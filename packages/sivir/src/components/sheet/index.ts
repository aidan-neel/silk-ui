import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type { ButtonProps } from '../button';
import Root from './sheet.svelte';
import Close from './sheet-close.svelte';
import Content from './sheet-content.svelte';
import Description from './sheet-description.svelte';
import Footer from './sheet-footer.svelte';
import Header from './sheet-header.svelte';
import Title from './sheet-title.svelte';
import Trigger from './sheet-trigger.svelte';

export type SheetProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: Snippet;
};

export type SheetTriggerProps = ButtonProps;
export type SheetTitleProps = DefaultProps;
export type SheetHeaderProps = DefaultProps;
export type SheetFooterProps = DefaultProps;
export type SheetDescriptionProps = DefaultProps;
export type SheetContentProps = {
    allowClickOutside?: boolean;
    side?: 'left' | 'right';
} & DefaultProps;

export type SheetCloseProps = ButtonProps;

export type SheetState = {
    open: boolean;
    triggerRef?: HTMLElement | null;
};

export { Close, Content, Description, Footer, Header, Root, Title, Trigger };

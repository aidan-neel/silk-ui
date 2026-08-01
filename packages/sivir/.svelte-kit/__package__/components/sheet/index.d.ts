import Root from './sheet.svelte';
import Trigger from './sheet-trigger.svelte';
import Title from './sheet-title.svelte';
import Header from './sheet-header.svelte';
import Footer from './sheet-footer.svelte';
import Description from './sheet-description.svelte';
import Content from './sheet-content.svelte';
import Close from './sheet-close.svelte';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { ButtonProps } from '../button';
import type { Snippet } from 'svelte';
export type SheetProps = {
    open?: boolean;
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
export { Root, Trigger, Title, Header, Footer, Description, Content, Close };

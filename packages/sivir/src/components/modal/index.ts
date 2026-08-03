import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './modal.svelte';
import Trigger from './modal-trigger.svelte';
import Content from './modal-content.svelte';
import Title from './modal-title.svelte';
import Description from './modal-description.svelte';
import Footer from './modal-footer.svelte';
import Header from './modal-header.svelte';
import Close from './modal-close.svelte';
import Confirm from './modal-confirm.svelte';
import Body from './modal-body.svelte';
import type { ButtonProps } from '../button';
import type { Snippet } from 'svelte';

export type ModalState = {
    open: boolean;
    error: boolean;
};

export type ModalTriggerProps = ButtonProps;
export type ModalTitleProps = DefaultProps;
export type ModalHeaderProps = DefaultProps;
export type ModalFooterProps = DefaultProps;
export type ModalBodyProps = DefaultProps;
export type ModalConfirmProps = ButtonProps;
export type ModalCloseProps = ButtonProps;
export type ModalDescriptionProps = DefaultProps;

export type ModalContentProps = {
    allowClickOutside?: boolean;
    allowEscape?: boolean;
    role?: 'dialog' | 'alertdialog';
    contentClass?: string;
    /** Optional explicit max-width class. Overrides the selected size preset. */
    maxWidthClass?: string;
    overlayClass?: string;
    surfaceClass?: string;
    panelIdPrefix?: string;
    showClose?: boolean;
    /** Max-width preset. Defaults to `md`. */
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
} & DefaultProps &
    Partial<Record<`aria-${string}`, string | boolean | null | undefined>>;

export type ModalProps = {
    open?: boolean;
    /** Sets supported browser chrome to red while the modal is open. */
    error?: boolean;
    children?: Snippet;
};

export { Root, Trigger, Content, Title, Description, Header, Body, Close, Footer, Confirm };

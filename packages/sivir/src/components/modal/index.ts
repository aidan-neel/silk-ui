import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type { ButtonProps } from '../button';
import Root from './modal.svelte';
import Body from './modal-body.svelte';
import Close from './modal-close.svelte';
import Confirm from './modal-confirm.svelte';
import Content from './modal-content.svelte';
import Description from './modal-description.svelte';
import Footer from './modal-footer.svelte';
import Header from './modal-header.svelte';
import Title from './modal-title.svelte';
import Trigger from './modal-trigger.svelte';

export type ModalState = {
    open: boolean;
    error: boolean;
    orientation: ModalOrientation;
};

export type ModalOrientation = 'horizontal' | 'vertical';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

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
    overlayClass?: string;
    surfaceClass?: string;
    panelIdPrefix?: string;
    showClose?: boolean;
    /** Width preset. Vertical layouts remain compact; horizontal layouts are one step wider. */
    size?: ModalSize;
} & DefaultProps &
    Partial<Record<`aria-${string}`, string | boolean | null | undefined>>;

export type ModalProps = {
    open?: boolean;
    /** Sets supported browser chrome to red while the modal is open. */
    error?: boolean;
    /** Controls the default width and action layout. Defaults to `horizontal`. */
    orientation?: ModalOrientation;
    children?: Snippet;
};

export { Body, Close, Confirm, Content, Description, Footer, Header, Root, Title, Trigger };

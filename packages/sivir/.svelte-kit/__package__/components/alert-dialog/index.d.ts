import type { ButtonProps } from '@sivir-ui/svelte/components/button';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import Root from './alert-dialog.svelte';
import Confirm from './alert-dialog-confirm.svelte';
import Content from './alert-dialog-content.svelte';
import Description from './alert-dialog-description.svelte';
import Exit from './alert-dialog-exit.svelte';
import Footer from './alert-dialog-footer.svelte';
import Header from './alert-dialog-header.svelte';
import Title from './alert-dialog-title.svelte';
import Trigger from './alert-dialog-trigger.svelte';
export type AlertDialogState = {
    open: boolean;
    triggerRef?: HTMLElement | null;
};
export type AlertDialogProps = {
    open?: boolean;
    /** Sets supported browser chrome to red while the alert dialog is open. */
    error?: boolean;
    children?: Snippet;
};
export type AlertDialogContentProps = {
    allowClickOutside?: boolean;
    allowEscape?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showClose?: boolean;
} & DefaultProps;
export type AlertDialogActionProps = {
    closeOnClick?: boolean;
} & ButtonProps;
export { Confirm, Content, Description, Exit, Footer, Header, Root, Title, Trigger };

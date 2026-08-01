import { type DefaultProps } from '@sivir-ui/svelte/utils';
type Props = {
    allowClickOutside?: boolean;
    /** Max-width preset. Defaults to `md`. */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Show the top-right close (X) button. Defaults to `true`. */
    showClose?: boolean;
} & DefaultProps;
declare const AlertDialogContent: import("svelte").Component<Props, {}, "">;
type AlertDialogContent = ReturnType<typeof AlertDialogContent>;
export default AlertDialogContent;

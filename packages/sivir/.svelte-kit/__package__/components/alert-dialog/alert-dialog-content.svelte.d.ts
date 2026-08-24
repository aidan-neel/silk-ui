import { type DefaultProps } from '@sivir-ui/svelte/utils';
type Props = {
    allowEscape?: boolean;
    ariaBusy?: boolean;
    /** Max-width preset. Defaults to `md`. */
    size?: 'sm' | 'md' | 'lg' | 'xl';
} & DefaultProps;
declare const AlertDialogContent: import("svelte").Component<Props, {}, "">;
type AlertDialogContent = ReturnType<typeof AlertDialogContent>;
export default AlertDialogContent;

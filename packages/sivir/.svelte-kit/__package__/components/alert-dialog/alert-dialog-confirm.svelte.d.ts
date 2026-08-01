import { type ButtonProps } from '@sivir-ui/svelte/components/button';
import { type DefaultProps } from '@sivir-ui/svelte/utils';
type Props = {
    onclick?: () => void;
} & DefaultProps & ButtonProps;
declare const AlertDialogConfirm: import("svelte").Component<Props, {}, "">;
type AlertDialogConfirm = ReturnType<typeof AlertDialogConfirm>;
export default AlertDialogConfirm;

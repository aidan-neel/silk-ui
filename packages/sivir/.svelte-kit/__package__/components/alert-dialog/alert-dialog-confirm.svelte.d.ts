import { type ButtonProps } from '@sivir-ui/svelte/components/button';
import { type DefaultProps } from '@sivir-ui/svelte/utils';
type Props = {
    closeOnClick?: boolean;
    onclick?: (event: MouseEvent) => void;
} & DefaultProps & ButtonProps;
declare const AlertDialogConfirm: import("svelte").Component<Props, {}, "">;
type AlertDialogConfirm = ReturnType<typeof AlertDialogConfirm>;
export default AlertDialogConfirm;

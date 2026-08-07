import { type ButtonProps } from '@sivir-ui/svelte/components/button';
import { type DefaultProps } from '@sivir-ui/svelte/utils';
type Props = {
    closeOnClick?: boolean;
    onclick?: (event: MouseEvent) => void;
} & DefaultProps &
    ButtonProps;
declare const AlertDialogExit: import('svelte').Component<Props, {}, ''>;
type AlertDialogExit = ReturnType<typeof AlertDialogExit>;
export default AlertDialogExit;

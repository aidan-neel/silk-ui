import { type ButtonProps } from '@sivir-ui/svelte/components/button';
import type { ComboboxItem } from '.';
type Props = {
    class?: string;
    value: string;
    label: string;
    callback?: () => void;
} & ButtonProps;
declare const ComboboxItem: import('svelte').Component<Props, {}, ''>;
type ComboboxItem = ReturnType<typeof ComboboxItem>;
export default ComboboxItem;

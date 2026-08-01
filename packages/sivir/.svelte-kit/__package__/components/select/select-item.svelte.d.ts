import { type ButtonProps } from '@sivir-ui/svelte/components/button';
import { type Snippet } from 'svelte';
type Props = {
    value: string;
    label?: string;
    children?: Snippet;
} & ButtonProps;
declare const SelectItem: import("svelte").Component<Props, {}, "">;
type SelectItem = ReturnType<typeof SelectItem>;
export default SelectItem;

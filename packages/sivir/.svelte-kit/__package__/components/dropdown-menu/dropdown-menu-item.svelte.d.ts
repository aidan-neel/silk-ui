import { type ButtonProps } from '@sivir-ui/svelte/components/button';
import type { Snippet } from 'svelte';
type Props = {
    class?: string;
    children?: Snippet;
    callback?: () => void;
} & ButtonProps;
declare const DropdownMenuItem: import("svelte").Component<Props, {}, "">;
type DropdownMenuItem = ReturnType<typeof DropdownMenuItem>;
export default DropdownMenuItem;

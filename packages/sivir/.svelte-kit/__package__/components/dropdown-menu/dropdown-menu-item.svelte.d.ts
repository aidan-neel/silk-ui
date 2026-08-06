import { type ButtonProps } from '@sivir-ui/svelte/components/button';
import type { Snippet } from 'svelte';
type Props = {
    children?: Snippet;
    callback?: () => void;
} & ButtonProps;
declare const DropdownMenuItem: import("svelte").Component<Props, {}, "element">;
type DropdownMenuItem = ReturnType<typeof DropdownMenuItem>;
export default DropdownMenuItem;

import * as Popover from '@sivir-ui/svelte/components/popover';
import type { Snippet } from 'svelte';
type Props = {
    children: Snippet;
    class?: string;
} & Omit<Popover.PopoverContentProps, 'children' | 'class' | 'surfaceClass'>;
declare const DropdownMenuContent: import("svelte").Component<Props, {}, "">;
type DropdownMenuContent = ReturnType<typeof DropdownMenuContent>;
export default DropdownMenuContent;

import type { Snippet } from 'svelte';
import * as Popover from '@sivir-ui/svelte/components/popover';
type SubTriggerProps = {
    class?: string;
    children?: Snippet;
} & Omit<Popover.PopoverTriggerProps, 'children' | 'class'>;
declare const DropdownMenuSubTrigger: import("svelte").Component<SubTriggerProps, {}, "">;
type DropdownMenuSubTrigger = ReturnType<typeof DropdownMenuSubTrigger>;
export default DropdownMenuSubTrigger;

import * as Popover from '@sivir-ui/svelte/components/popover';
import { type Snippet } from 'svelte';
type SubTriggerProps = {
    class?: string;
    children?: Snippet;
} & Omit<Popover.PopoverTriggerProps, 'children' | 'class'>;
declare const DropdownMenuSubTrigger: import("svelte").Component<SubTriggerProps, {}, "">;
type DropdownMenuSubTrigger = ReturnType<typeof DropdownMenuSubTrigger>;
export default DropdownMenuSubTrigger;

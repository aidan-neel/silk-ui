import type { ButtonVariant } from '@sivir-ui/svelte/components/button';
import * as Popover from '@sivir-ui/svelte/components/popover';
import { type Snippet } from 'svelte';
type Props = {
    children: Snippet;
    class?: string;
    variant?: ButtonVariant;
} & Omit<Popover.PopoverTriggerProps, 'children' | 'class' | 'variant'>;
declare const DropdownMenuTrigger: import('svelte').Component<Props, {}, ''>;
type DropdownMenuTrigger = ReturnType<typeof DropdownMenuTrigger>;
export default DropdownMenuTrigger;

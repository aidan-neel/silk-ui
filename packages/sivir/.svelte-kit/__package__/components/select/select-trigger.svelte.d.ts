import * as Popover from '@sivir-ui/svelte/components/popover';
import { type Snippet } from 'svelte';
import type { ButtonVariant } from '@sivir-ui/svelte/components/button';
type Props = {
    children?: Snippet;
    class?: string;
    variant?: ButtonVariant;
} & Omit<Popover.PopoverTriggerProps, 'children' | 'class' | 'variant'>;
declare const SelectTrigger: import("svelte").Component<Props, {}, "">;
type SelectTrigger = ReturnType<typeof SelectTrigger>;
export default SelectTrigger;

import type { PopoverTriggerProps } from '@sivir-ui/svelte/components/popover';
import { type Snippet } from 'svelte';
type Props = Omit<PopoverTriggerProps, 'children'> & {
    trailing?: Snippet;
    placeholder?: string;
    searchPlacement?: 'trigger' | 'menu';
    threshold?: number;
    appearance?: 'button' | 'input';
};
declare const ComboboxTrigger: import("svelte").Component<Props, {}, "">;
type ComboboxTrigger = ReturnType<typeof ComboboxTrigger>;
export default ComboboxTrigger;

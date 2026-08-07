import type { PopoverTriggerProps } from '@sivir-ui/svelte/components/popover';
type Props = Omit<PopoverTriggerProps, 'children'> & {
    placeholder?: string;
    searchPlacement?: 'trigger' | 'menu';
    threshold?: number;
};
declare const ComboboxTrigger: import('svelte').Component<Props, {}, ''>;
type ComboboxTrigger = ReturnType<typeof ComboboxTrigger>;
export default ComboboxTrigger;

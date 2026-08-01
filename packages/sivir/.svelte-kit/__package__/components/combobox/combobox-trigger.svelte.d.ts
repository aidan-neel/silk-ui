import type { PopoverTriggerProps } from '@sivir-ui/svelte/components/popover';
type Props = Omit<PopoverTriggerProps, 'children'> & {
    threshold?: number;
};
declare const ComboboxTrigger: import("svelte").Component<Props, {}, "">;
type ComboboxTrigger = ReturnType<typeof ComboboxTrigger>;
export default ComboboxTrigger;

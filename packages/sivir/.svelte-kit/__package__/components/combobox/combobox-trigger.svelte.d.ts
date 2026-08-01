import * as Popover from '@sivir-ui/svelte/components/popover';
interface Props extends Omit<Popover.PopoverTriggerProps, 'children'> {
    class?: string;
    threshold?: number;
}
declare const ComboboxTrigger: import("svelte").Component<Props, {}, "">;
type ComboboxTrigger = ReturnType<typeof ComboboxTrigger>;
export default ComboboxTrigger;

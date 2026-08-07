type $$ComponentProps = {
    checked: boolean;
    label?: string;
    description?: string;
    disabled?: boolean;
    variant?: 'default' | 'primary';
    class?: string;
};
declare const Checkbox: import("svelte").Component<$$ComponentProps, {}, "checked">;
type Checkbox = ReturnType<typeof Checkbox>;
export default Checkbox;

import type { Snippet } from 'svelte';
type Props = {
    children: Snippet;
    value?: string;
};
declare const Select: import("svelte").Component<Props, {}, "value">;
type Select = ReturnType<typeof Select>;
export default Select;

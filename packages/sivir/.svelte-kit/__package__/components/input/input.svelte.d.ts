import type { HTMLInputAttributes } from 'svelte/elements';
type $$ComponentProps = {
    placeholder?: string;
    label?: string;
    description?: string;
    type?: string;
    variant?: 'outline' | 'secondary';
    class?: string;
    element?: HTMLInputElement | undefined;
    value?: string | number | boolean | FileList | undefined;
    checked?: boolean | undefined;
    files?: FileList | undefined;
} & HTMLInputAttributes;
declare const Input: import("svelte").Component<$$ComponentProps, {}, "value" | "element" | "checked" | "files">;
type Input = ReturnType<typeof Input>;
export default Input;

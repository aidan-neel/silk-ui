import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import Input from './input.svelte';

export type InputProps = {
    placeholder?: string;
    label?: string;
    description?: string;
    type?: string;
    variant?: 'outline' | 'secondary';
    class?: string;
    leading?: Snippet;
    trailing?: Snippet;
    element?: HTMLInputElement | undefined;
    value?: string | number | boolean | FileList | undefined;
    checked?: boolean | undefined;
    files?: FileList | undefined;
} & HTMLInputAttributes;

export { Input };
export default Input;

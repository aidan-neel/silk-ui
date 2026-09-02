import type { Snippet } from 'svelte';
import type { HTMLTextareaAttributes } from 'svelte/elements';
import Textarea from './textarea.svelte';

export type TextareaProps = {
    placeholder?: string;
    label?: string;
    description?: string;
    variant?: 'outline' | 'secondary';
    autoresize?: boolean;
    class?: string;
    children?: Snippet;
    element?: HTMLTextAreaElement | undefined;
    value?: string | number | null | undefined;
} & HTMLTextareaAttributes;

export { Textarea };
export default Textarea;

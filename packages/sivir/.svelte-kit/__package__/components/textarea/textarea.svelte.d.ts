import type { Snippet } from 'svelte';
import type { HTMLTextareaAttributes } from 'svelte/elements';
type $$ComponentProps = {
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
declare const Textarea: import("svelte").Component<$$ComponentProps, {}, "value" | "element">;
type Textarea = ReturnType<typeof Textarea>;
export default Textarea;

import type { Snippet } from 'svelte';
type Variant = 'info' | 'error' | 'success' | 'warning';
type $$ComponentProps = {
    variant?: Variant;
    children: Snippet;
    class?: string;
};
declare const Alert: import('svelte').Component<$$ComponentProps, {}, ''>;
type Alert = ReturnType<typeof Alert>;
export default Alert;

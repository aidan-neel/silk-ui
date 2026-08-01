import type { Component, Snippet } from 'svelte';
type $$ComponentProps = {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'info' | 'success' | 'warning' | 'error';
    children?: Snippet;
    class?: string;
    href?: string;
    icon?: Component<{
        size?: number | string;
        class?: string;
    }>;
    iconSize?: number | string;
    dot?: boolean;
} & Record<string, unknown>;
declare const Badge: Component<$$ComponentProps, {}, "">;
type Badge = ReturnType<typeof Badge>;
export default Badge;

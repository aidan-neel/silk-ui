import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Component, Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
import Badge from './badge.svelte';
export type BadgeVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'info' | 'success' | 'warning' | 'error';
export type BadgeProps = {
    variant?: BadgeVariant;
    href?: string;
    icon?: Component<{
        size?: number | string;
        class?: string;
    }>;
    iconSize?: number | string;
    dot?: boolean;
    children?: Snippet;
} & DefaultProps & Partial<HTMLAnchorAttributes & HTMLAttributes<HTMLDivElement>>;
export { Badge };
export default Badge;

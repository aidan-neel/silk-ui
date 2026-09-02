<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { page } from '$app/state';
    import type { BreadcrumbItemProps } from '.';

    let { href, class: className, children, ...rest }: BreadcrumbItemProps = $props();
</script>

<a
    {...rest}
    {href}
    class={cn(
        className,
        `${page.url.pathname === href ? 'text-foreground [font-size:var(--font-size-body)] [font-weight:var(--font-weight-header)] [letter-spacing:var(--tracking-body)]' : 'text-foreground-muted hover:text-foreground [transition-duration:var(--motion-duration-panel)]'} [font-size:var(--font-size-body)]`
    )}
>
    {@render children?.()}
</a>

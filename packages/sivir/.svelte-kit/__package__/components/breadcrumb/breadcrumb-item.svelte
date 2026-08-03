<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { BreadcrumbItemProps } from '.';
    import { page } from '$app/state';

    let { href, class: className, children, ...rest }: BreadcrumbItemProps = $props();
</script>

<a
    {...rest}
    {href}
    class={cn(
        className,
        `${page.url.pathname === href ? 'text-foreground [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)]' : 'text-foreground-muted hover:text-foreground duration-200'} [font-size:var(--font-size-body,16px)]`
    )}
>
    {@render children?.()}
</a>

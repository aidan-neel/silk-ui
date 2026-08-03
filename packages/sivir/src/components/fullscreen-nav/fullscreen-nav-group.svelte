<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { FullscreenNavGroupProps } from '.';

    let { class: className, heading, children, ...rest }: FullscreenNavGroupProps = $props();
    const groupId = $props.id();
    const headingId = `fullscreen-nav-group-${groupId}`;
</script>

<section
    data-ui="fullscreen-nav-group"
    role="group"
    aria-labelledby={headingId}
    class={cn(className, 'flex flex-col gap-2')}
    {...rest}
>
    <h2
        id={headingId}
        class="text-[length:var(--text-xs)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
    >
        {heading}
    </h2>
    <div class="flex flex-col gap-1">
        {@render children?.()}
    </div>
</section>

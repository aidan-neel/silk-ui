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
    class={cn(className, 'flex flex-col gap-3')}
    {...rest}
>
    <h2
        id={headingId}
        class="[font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] text-foreground-muted"
    >
        {heading}
    </h2>
    <div class="flex flex-col">
        {@render children?.()}
    </div>
</section>

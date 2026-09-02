<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { LabelProps } from '.';

    let { class: className, children, ...rest }: LabelProps = $props();
</script>

<label
    data-ui="label"
    class={cn(
        className,
        'select-none [font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-[var(--opacity-disabled)]'
    )}
    {...rest}
>
    {@render children?.()}
</label>

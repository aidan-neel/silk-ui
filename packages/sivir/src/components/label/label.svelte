<script lang="ts">
import { cn } from '@sivir-ui/svelte/utils';
import type { LabelProps } from '.';

let { class: className, children, ...rest }: LabelProps = $props();
</script>

<label
    data-ui="label"
    class={cn(
        className,
        'text-[length:var(--text-sm)] select-none [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-60'
    )}
    {...rest}
>
    {@render children?.()}
</label>

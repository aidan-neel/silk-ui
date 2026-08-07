<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ToolInputProps } from '.';

    let { label = 'Input', children, class: className, ...rest }: ToolInputProps = $props();
</script>

<div data-ui="tool-input" class={cn(className, 'flex flex-col gap-1.5')} {...rest}>
    <span class="text-xs font-[var(--font-weight-label)] text-foreground-muted">{label}</span>
    <pre
        class="overflow-x-auto rounded-[var(--radius-md)] border border-border bg-card px-2.5 py-2 font-mono text-xs leading-5 text-foreground"
    ><code
            >{@render children?.()}</code
        ></pre>
</div>

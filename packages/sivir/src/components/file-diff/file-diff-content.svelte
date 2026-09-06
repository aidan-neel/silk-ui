<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { FileDiffContentProps } from '.';

    let { children, class: className, ...rest }: FileDiffContentProps = $props();
</script>

<div
    data-ui="file-diff-content"
    class={cn(
        className,
        'sivir-inset-surface max-h-[var(--file-diff-max-height)] w-full overflow-auto font-mono text-[length:var(--font-size-label)] leading-[var(--file-diff-line-height)]'
    )}
    {...rest}
>
    {@render children?.()}
</div>

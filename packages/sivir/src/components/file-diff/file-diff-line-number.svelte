<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { FileDiffLineNumberProps } from '.';

    let { value, tone = 'context', class: className, ...rest }: FileDiffLineNumberProps = $props();

    const toneClass = $derived(
        tone === 'add' ? 'text-success' : tone === 'remove' ? 'text-error' : 'text-foreground-muted'
    );
</script>

<span
    data-ui="file-diff-line-number"
    data-tone={tone}
    aria-hidden="true"
    class={cn(
        className,
        'w-full shrink-0 truncate pr-2 text-right font-medium tabular-nums select-none',
        toneClass
    )}
    {...rest}
    >{value ?? ''}</span
>

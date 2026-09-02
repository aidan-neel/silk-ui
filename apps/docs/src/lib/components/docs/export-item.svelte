<script lang="ts">
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import type { Snippet } from 'svelte';

    let {
        children,
        class: classProp,
        title,
        ...rest
    }: {
        children: Snippet;
        class?: string;
        title: string;
    } = $props();
</script>

<Typography.Text {...rest} variant="supporting" class={classProp}>
    <span class="text-foreground px-3">•</span
    ><span
        class="text-foreground [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] [font-family:var(--font-header),sans-serif]"
        >{title}
        -</span
    >
    {@render children?.()}
</Typography.Text>

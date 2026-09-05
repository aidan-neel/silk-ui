<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TagInputListProps } from '.';
    import { getTagInputContext } from './context.svelte';
    import Tag from './tag-input-tag.svelte';

    let {
        label = 'Tags',
        class: className,
        children,
        'aria-label': ariaLabel,
        ...rest
    }: TagInputListProps = $props();

    const context = getTagInputContext();
</script>

{#if context.tags.length > 0 || children}
    <ul
        {...rest}
        data-ui="tag-input-list"
        aria-label={ariaLabel ?? label}
        class={cn(className, 'contents')}
    >
        {#if children}
            {@render children()}
        {:else}
            {#each context.tags as tag, index (index)}
                <li class="contents">
                    <Tag value={tag} {index} />
                </li>
            {/each}
        {/if}
    </ul>
{/if}

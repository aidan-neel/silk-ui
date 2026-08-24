<script lang="ts">
    import type { Snippet } from 'svelte';

    const { children }: { children: Snippet } = $props();
</script>

<div
    class="mx-auto flex min-h-[calc(100svh-5.25rem)] w-full max-w-[792px] flex-1 flex-col px-4 pt-10 sm:px-6"
    data-docs-page
>
    {@render children?.()}
    <div class="h-32 shrink-0" aria-hidden="true"></div>
</div>

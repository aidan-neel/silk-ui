<script lang="ts">
    import type { Snippet } from 'svelte';

    const { children }: { children: Snippet } = $props();
</script>

<div
    class="mx-auto flex min-h-[calc(100svh-6.5rem)] w-full max-w-[960px] flex-col px-5 pt-8 sm:px-8 lg:px-10 lg:pt-10"
>
    {@render children?.()}
    <div class="h-32 shrink-0" aria-hidden="true"></div>
</div>

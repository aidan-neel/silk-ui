<script lang="ts">
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
</script>

<div
    class="flex w-full max-w-sm items-center gap-2 rounded-[var(--radius-md)] border border-border bg-card px-3 py-2"
>
    <code class="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
        bunx @sivir-ui/svelte add copy-button
    </code>
    <CopyButton text="bunx @sivir-ui/svelte add copy-button" />
</div>

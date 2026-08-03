<script lang="ts">
    import * as CodeBlock from '@sivir-ui/svelte/components/code-block';
</script>

<!-- copyPlacement="inline": a single-line body with the copy centered on the far right. -->
<CodeBlock.Root class="max-w-md" value="sh">
    <CodeBlock.Content
        value="sh"
        code="bunx @sivir-ui/svelte add code-block"
        lang="bash"
        copyPlacement="inline"
    />
</CodeBlock.Root>

<script lang="ts">
    import type { FileDiffLine } from '@sivir-ui/svelte/components/file-diff';
    import * as FileDiff from '@sivir-ui/svelte/components/file-diff';

    const diff: FileDiffLine[] = [
        {
            type: 'context',
            oldLineNumber: 4,
            newLineNumber: 4,
            content: '  color: var(--color-foreground);'
        },
        {
            type: 'remove',
            oldLineNumber: 5,
            content: '  background: #f4f4f0;'
        },
        {
            type: 'add',
            newLineNumber: 5,
            content: '  background: var(--color-card);'
        },
        {
            type: 'context',
            oldLineNumber: 6,
            newLineNumber: 6,
            content: '  border: 1px solid var(--color-border);'
        }
    ];
</script>

<FileDiff.Root file="src/styles.css" lang="css" {diff} showLineNumbers={false} class="max-w-2xl" />

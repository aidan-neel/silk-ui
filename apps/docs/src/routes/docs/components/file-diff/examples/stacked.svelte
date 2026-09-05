<script lang="ts">
    import type { FileDiffLine } from '@sivir-ui/svelte/components/file-diff';
    import * as FileDiff from '@sivir-ui/svelte/components/file-diff';

    const authDiff: FileDiffLine[] = [
        {
            type: 'context',
            oldLineNumber: 12,
            newLineNumber: 12,
            content: 'export function getToken() {'
        },
        {
            type: 'remove',
            oldLineNumber: 13,
            content: '  return localStorage.token;'
        },
        {
            type: 'add',
            newLineNumber: 13,
            content: '  const t = cookies.get("session");'
        },
        {
            type: 'add',
            newLineNumber: 14,
            content: '  if (!t) throw new Error("no session");'
        },
        {
            type: 'add',
            newLineNumber: 15,
            content: '  return t;'
        },
        {
            type: 'context',
            oldLineNumber: 14,
            newLineNumber: 16,
            content: '}'
        }
    ];

    const stylesDiff: FileDiffLine[] = [
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

<div class="flex w-full max-w-2xl flex-col gap-4">
    <FileDiff.Root file="src/auth.ts" lang="ts" diff={authDiff} />
    <FileDiff.Root file="src/styles.css" lang="css" diff={stylesDiff} />
</div>

<script lang="ts">
    import type { FileDiffLine } from '@sivir-ui/svelte/components/file-diff';
    import * as FileDiff from '@sivir-ui/svelte/components/file-diff';

    const diff: FileDiffLine[] = [
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
</script>

<FileDiff.Root file="src/auth.ts" lang="ts" {diff} class="max-w-2xl" />

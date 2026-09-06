<script lang="ts">
    import Expand from '@lucide/svelte/icons/expand';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as FileDiff from '@sivir-ui/svelte/components/file-diff';
</script>

<FileDiff.Root file="src/auth.ts" lang="ts" additions={3} deletions={1} class="max-w-2xl">
    <FileDiff.TopBar>
        <FileDiff.Filename />
        <FileDiff.PlusMinus />
        <Button variant="ghost" size="icon" class="size-7" aria-label="Expand diff">
            <Expand size={14} />
        </Button>
    </FileDiff.TopBar>
    <FileDiff.Content>
        <FileDiff.Row
            type="context"
            oldLine={12}
            newLine={12}
            code={'export function getToken() {'}
        />
        <FileDiff.Row type="remove" oldLine={13} code="  return localStorage.token;" />
        <FileDiff.Row type="add" newLine={13} code={'  const t = cookies.get("session");'} />
        <FileDiff.Row type="add" newLine={14} code={'  if (!t) throw new Error("no session");'} />
        <FileDiff.Row type="add" newLine={15} code="  return t;" />
        <FileDiff.Row type="context" oldLine={14} newLine={16} code={'}'} />
    </FileDiff.Content>
</FileDiff.Root>

<script lang="ts">
    import * as FileDiff from '@sivir-ui/svelte/components/file-diff';

    let {
        file = 'src/auth.ts',
        additions = 3,
        deletions = 1
    }: {
        file?: string;
        additions?: number;
        deletions?: number;
    } = $props();
</script>

<FileDiff.Root {file} lang="ts" {additions} {deletions}>
    <FileDiff.TopBar>
        <FileDiff.Filename file="custom.ts" />
        <FileDiff.PlusMinus additions={9} />
        <button type="button">Expand</button>
    </FileDiff.TopBar>
    <FileDiff.Content>
        <FileDiff.Row type="context" code="x" />
    </FileDiff.Content>
</FileDiff.Root>

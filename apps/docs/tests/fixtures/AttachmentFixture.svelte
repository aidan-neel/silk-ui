<script lang="ts">
    import type { AttachmentRejection } from '@sivir-ui/svelte/components/attachment';
    import * as Attachment from '@sivir-ui/svelte/components/attachment';

    let {
        accept = '.txt',
        maxFiles = 2,
        maxSize = 1024
    }: { accept?: string; maxFiles?: number; maxSize?: number } = $props();

    let files = $state<File[]>([]);
    let rejections = $state<AttachmentRejection[]>([]);
</script>

<Attachment.Root bind:files {accept} {maxFiles} {maxSize} onReject={(next) => (rejections = next)}>
    <Attachment.Trigger>Choose files</Attachment.Trigger>
    <Attachment.List />
</Attachment.Root>

<p data-testid="attachment-count">{files.length}</p>
<p data-testid="rejection-codes">
    {rejections.map(({ file, code }) => `${file.name}:${code}`).join('|')}
</p>

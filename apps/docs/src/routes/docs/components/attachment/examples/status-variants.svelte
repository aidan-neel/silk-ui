<script lang="ts">
    import type { AttachmentStatus } from '@sivir-ui/svelte/components/attachment';
    import * as Attachment from '@sivir-ui/svelte/components/attachment';
    import { onMount } from 'svelte';

    type Example = {
        file: File;
        status: AttachmentStatus;
        progress?: number;
        error?: string;
    };

    let examples = $state.raw<Example[]>([]);

    onMount(() => {
        examples = [
            {
                file: new File([new Uint8Array(48_000)], 'release-notes.md', {
                    type: 'text/markdown'
                }),
                status: 'ready'
            },
            {
                file: new File([new Uint8Array(620_000)], 'architecture.pdf', {
                    type: 'application/pdf'
                }),
                status: 'uploading',
                progress: 64
            },
            {
                file: new File([new Uint8Array(384_000)], 'audit-log.csv', { type: 'text/csv' }),
                status: 'complete'
            },
            {
                file: new File([new Uint8Array(112_000)], 'secrets.env', { type: 'text/plain' }),
                status: 'error',
                error: 'Blocked by policy'
            }
        ];
    });
</script>

<div class="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
    {#each examples as example (example.file.name)}
        <Attachment.Item
            file={example.file}
            status={example.status}
            progress={example.progress}
            error={example.error}
            removable={false}
        />
    {/each}
</div>

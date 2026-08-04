<script lang="ts">
import * as Attachment from '@sivir-ui/svelte/components/attachment';

let files = $state<File[]>([]);
</script>

<Attachment.Root
    bind:files
    accept="image/png,image/jpeg,.pdf"
    maxFiles={3}
    maxSize={5 * 1024 * 1024}
    class="mx-auto flex w-full max-w-xl flex-col items-center gap-2"
>
    <Attachment.Trigger variant="outline" size="md">Choose files</Attachment.Trigger>
    <Attachment.List class="self-stretch items-center sm:justify-center" />
</Attachment.Root>

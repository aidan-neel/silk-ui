<script lang="ts">
    import { CopyButton } from '@sivir-ui/svelte/components/copy-button';
</script>

<div class="flex items-center gap-3">
    <CopyButton text="ghost variant" label="Ghost" />
    <CopyButton text="outline variant" label="Outline" variant="outline" />
    <CopyButton text="secondary variant" label="Secondary" variant="secondary" />
</div>

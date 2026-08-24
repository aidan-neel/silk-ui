<script lang="ts">
    import Bold from '@lucide/svelte/icons/bold';
    import { Toggle } from '@sivir-ui/svelte/components/toggle';

    let bold = $state(true);
</script>

<Toggle bind:pressed={bold} aria-label="Bold">
    <Bold size={14} />
</Toggle>

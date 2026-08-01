<script lang="ts">
    import { Toggle } from '@sivir-ui/svelte/components/toggle';
    import Bold from '@lucide/svelte/icons/bold';

    let bold = $state(true);
</script>

<Toggle bind:pressed={bold} aria-label="Bold">
    <Bold size={14} />
</Toggle>

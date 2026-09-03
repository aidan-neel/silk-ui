<script lang="ts">
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
</script>

<div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-foreground-muted">
    <span class="flex items-center gap-2">
        <Spinner aria-hidden="true" />
        <span>Default</span>
    </span>
    <span class="flex items-center gap-2">
        <Spinner speed={2} aria-hidden="true" />
        <span>Speed 2</span>
    </span>
    <span class="flex items-center gap-2">
        <Spinner curved aria-hidden="true" />
        <span>Curved</span>
    </span>
</div>

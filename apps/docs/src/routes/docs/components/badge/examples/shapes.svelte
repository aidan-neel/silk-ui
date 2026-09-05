<script lang="ts">
    import { Badge } from '@sivir-ui/svelte/components/badge';
</script>

<div class="flex flex-wrap items-center gap-2">
    <Badge class="rounded-full px-2.5">Beta</Badge>
    <Badge class="size-8 rounded-full px-0 py-0">8</Badge>
    <Badge class="rounded-sm">Draft</Badge>
    <Badge variant="outline" class="rounded-[var(--radius-lg)]">Live</Badge>
</div>

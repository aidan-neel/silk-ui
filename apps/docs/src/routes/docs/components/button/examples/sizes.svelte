<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import Heart from '@lucide/svelte/icons/heart';
</script>

<div class="flex flex-wrap items-center justify-center gap-4">
    <Button size="sm">Small</Button>
    <Button>Medium</Button>
    <Button size="lg">Large</Button>
    <Button size="icon"><Heart size={14} /></Button>
</div>

<script lang="ts">
    import Download from '@lucide/svelte/icons/download';
    import Send from '@lucide/svelte/icons/send';
    import Trash from '@lucide/svelte/icons/trash-2';
    import { Button } from '@sivir-ui/svelte/components/button';
</script>

<div class="flex items-center gap-2">
    <Button variant="ghost"><Download size={14} /></Button>
    <Button variant="ghost"><Send size={14} /></Button>
    <Button variant="ghost"><Trash size={14} /></Button>
</div>

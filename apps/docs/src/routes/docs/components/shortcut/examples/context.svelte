<script lang="ts">
    import Shortcut from '@sivir-ui/svelte/components/shortcut';
    import { Button } from '@sivir-ui/svelte/components/button';
</script>

<Button variant="outline">
    Open command menu
    <Shortcut shortcut="cmd+K" />
</Button>

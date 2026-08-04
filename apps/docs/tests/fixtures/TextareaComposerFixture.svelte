<script lang="ts">
import { Textarea } from '@sivir-ui/svelte/components/textarea';
import { Toolbar } from '@sivir-ui/svelte/components/toolbar';
</script>

<Textarea autoresize aria-label="Message">
    <Toolbar aria-label="Message actions" />
</Textarea>

<script lang="ts">
import * as Avatar from '@sivir-ui/svelte/components/avatar';
</script>

<div class="flex items-center justify-center">
    <Avatar.Root>
        <Avatar.Image src="https://github.com/shadcn.png" alt="User" />
        <Avatar.Fallback>AB</Avatar.Fallback>
    </Avatar.Root>
</div>

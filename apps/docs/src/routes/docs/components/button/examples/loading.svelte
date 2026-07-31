<script lang="ts">
	import { Button } from '@sivir-ui/svelte/components/button';
	import Loader from '@lucide/svelte/icons/loader-circle';
</script>

<Button disabled>
	<Loader size={14} class="animate-spin" />
	Saving…
</Button>

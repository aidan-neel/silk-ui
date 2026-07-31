<script lang="ts">
	import { Progress } from '@sivir-ui/svelte/components/progress';
	import { Skeleton } from '@sivir-ui/svelte/components/skeleton';
	import { Toaster } from '@sivir-ui/svelte/components/toast';
</script>

<div data-testid="motion-skeleton"><Skeleton /></div>
<Progress data-testid="motion-progress" indeterminate />
<Toaster />

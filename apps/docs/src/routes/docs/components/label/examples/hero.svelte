<script lang="ts">
	import { Label } from '@sivir-ui/svelte/components/label';
	import { Input } from '@sivir-ui/svelte/components/input';
</script>

<div class="flex flex-col gap-1.5">
	<Label for="email">Email address</Label>
	<Input id="email" type="email" placeholder="you@sivir.dev" />
</div>

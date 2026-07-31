<script lang="ts">
	import { Label } from '@sivir-ui/svelte/components/label';
	import { Input } from '@sivir-ui/svelte/components/input';
</script>

<div class="flex flex-col gap-1.5">
	<Label for="disabled">Username</Label>
	<Input id="disabled" type="text" disabled />
</div>

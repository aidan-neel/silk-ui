<script lang="ts">
    import { Input } from '@sivir-ui/svelte/components/input';
    import { Label } from '@sivir-ui/svelte/components/label';
</script>

<div class="flex flex-col gap-1.5">
    <Label for="disabled">Username</Label>
    <Input id="disabled" type="text" disabled />
</div>

<script lang="ts">
    import { Input } from '@sivir-ui/svelte/components/input';
    import { Label } from '@sivir-ui/svelte/components/label';
</script>

<div class="flex flex-col gap-1.5">
    <Label for="name">Full name <span class="text-error">*</span></Label>
    <Input id="name" type="text" />
</div>

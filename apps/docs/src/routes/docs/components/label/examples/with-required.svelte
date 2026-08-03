<script lang="ts">
    import { Label } from '@sivir-ui/svelte/components/label';
    import { Input } from '@sivir-ui/svelte/components/input';
</script>

<div class="flex flex-col gap-1.5">
    <Label for="name">Full name <span class="text-error">*</span></Label>
    <Input id="name" type="text" />
</div>

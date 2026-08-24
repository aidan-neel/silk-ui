<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import * as Breadcrumb from '@sivir-ui/svelte/components/breadcrumb';
</script>

<div class="flex items-center justify-center">
    <Breadcrumb.Root>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
        <Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
        <Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
        <Breadcrumb.Item>Current</Breadcrumb.Item>
    </Breadcrumb.Root>
</div>

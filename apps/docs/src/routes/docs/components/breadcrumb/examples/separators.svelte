<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import * as Breadcrumb from '@sivir-ui/svelte/components/breadcrumb';
</script>

<div class="flex flex-col gap-6">
    <div class="flex items-center justify-center">
        <Breadcrumb.Root>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Separator><ChevronRight size={12} /></Breadcrumb.Separator>
            <Breadcrumb.Item>Page</Breadcrumb.Item>
        </Breadcrumb.Root>
    </div>
    <div class="flex items-center justify-center">
        <Breadcrumb.Root>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Separator>/</Breadcrumb.Separator>
            <Breadcrumb.Item>Page</Breadcrumb.Item>
        </Breadcrumb.Root>
    </div>
</div>

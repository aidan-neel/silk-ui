<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import Home from '@lucide/svelte/icons/home';
    import * as Breadcrumb from '@sivir-ui/svelte/components/breadcrumb';
</script>

<div class="flex items-center justify-center">
    <Breadcrumb.Root>
        <Breadcrumb.Item href="/">
            <Home size={13} />
        </Breadcrumb.Item>
        <Breadcrumb.Separator><ChevronRight size={12} /></Breadcrumb.Separator>
        <Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
        <Breadcrumb.Separator><ChevronRight size={12} /></Breadcrumb.Separator>
        <Breadcrumb.Item>Components</Breadcrumb.Item>
    </Breadcrumb.Root>
</div>

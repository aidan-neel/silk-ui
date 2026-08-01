<script lang="ts">
    import OnThisPage from '$lib/components/docs/on-this-page.svelte';
    import SideNavbar from '$lib/components/docs/side-navbar.svelte';
    import DocsPager from '$lib/components/docs/docs-pager.svelte';
    import type { Snippet } from 'svelte';

    const { children }: { children: Snippet } = $props();
</script>

<SideNavbar class="hidden sticky top-16 h-[calc(100vh-4rem)] w-64 flex-shrink-0 pt-8 lg:flex" />
<div class="flex w-full min-w-0 flex-1 justify-center lg:px-10">
    <div
        class="relative flex min-h-[calc(100vh-4rem)] w-full min-w-0 max-w-[760px] flex-1 flex-col py-8"
        data-docs-page
    >
        <div class="absolute right-0 top-8 z-10">
            <DocsPager />
        </div>
        {@render children?.()}
    </div>
</div>
<OnThisPage
    class="hidden sticky top-16 h-[calc(100vh-4rem)] w-64 flex-shrink-0 pl-8 pt-8 xl:block"
/>

<script lang="ts">
    import { Pagination } from '@sivir-ui/svelte/components/pagination';

    let page = $state(8);
</script>

<div class="flex justify-center p-6">
    <Pagination bind:page total={20} siblings={2} />
</div>

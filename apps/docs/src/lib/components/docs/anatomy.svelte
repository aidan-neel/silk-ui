<script lang="ts">
    import * as Typography from '@sivir-ui/svelte/components/typography';
    import type { ComponentPart } from '$lib/component-anatomy';

    let { items }: { items: readonly ComponentPart[] } = $props();
</script>

<section id="anatomy" class="mt-12 scroll-mt-20 flex flex-col gap-4">
    <Typography.H2 class="docs-section-heading">Anatomy</Typography.H2>
    <div class="max-w-2xl">
        {#each items as item (item.name)}
            <Typography.Text
                variant="supporting"
                class="my-0 border-b border-border py-2.5 first:pt-0 last:border-b-0 last:pb-0"
            >
                <Typography.InlineCode>{item.name}</Typography.InlineCode>
                - {item.description}
            </Typography.Text>
        {/each}
    </div>
</section>

<script lang="ts">
import type { ComponentPart } from '$lib/component-anatomy';

let { items }: { items: readonly ComponentPart[] } = $props();
</script>

<section id="anatomy" class="mt-12 scroll-mt-20 flex flex-col gap-4">
    <h2
        class="text-[1.25rem] font-[var(--font-weight-header,600)] tracking-tight text-foreground docs-section-heading"
    >
        Anatomy
    </h2>
    <div class="max-w-2xl text-sm leading-6 text-foreground-muted">
        {#each items as item (item.name)}
            <p class="my-0 border-b border-border py-2.5 first:pt-0 last:border-b-0 last:pb-0">
                <code class="font-medium text-foreground">{item.name}</code> - {item.description}
            </p>
        {/each}
    </div>
</section>

<script lang="ts">
import * as Breadcrumb from '@sivir-ui/svelte/components/breadcrumb';

let {
    items = [],
    class: classProp = ''
}: {
    items?: Array<{ label: string; href?: string }>;
    class?: string;
} = $props();
</script>

<Breadcrumb.Root class={`text-sm text-foreground-muted ${classProp}`}>
    {#each items as item, index (item.label)}
        <Breadcrumb.Item>
            {#if item.href && index < items.length - 1}
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- href is supplied by the caller as an already-resolved pathname -->
                <a href={item.href} class="transition-colors hover:text-foreground">
                    {item.label}
                </a>
            {:else}
                <span class={index === items.length - 1 ? 'text-foreground' : ''}>
                    {item.label}
                </span>
            {/if}
        </Breadcrumb.Item>
        {#if index < items.length - 1}
            <Breadcrumb.Separator />
        {/if}
    {/each}
</Breadcrumb.Root>

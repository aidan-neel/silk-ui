<script lang="ts">
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import * as Typography from '@sivir-ui/svelte/components/typography';

    let {
        title,
        description,
        eyebrow,
        compact = false
    }: {
        title: string;
        description?: string;
        eyebrow?: string;
        compact?: boolean;
    } = $props();
</script>

<header class="pb-6" data-page-header>
    <div class="flex flex-col gap-4">
        {#if eyebrow}
            <Badge variant="outline" class="w-fit px-3 text-[0.76rem]">
                {eyebrow}
            </Badge>
        {/if}

        <div class="flex flex-col gap-3">
            <Typography.H1
                class={`m-0 max-w-[12ch] leading-[1] ${
                    compact
                        ? 'text-[clamp(2rem,3vw,2.5rem)] md:max-w-[18ch]'
                        : 'text-[clamp(2.2rem,3.8vw,3rem)]'
                } max-md:max-w-none max-md:text-[clamp(1.6rem,7vw,2.2rem)]`}
            >
                {title}
            </Typography.H1>
            {#if description}
                <Typography.Text variant="lead" class="m-0 max-w-[46rem]">
                    {description}
                </Typography.Text>
            {/if}
        </div>
    </div>
</header>

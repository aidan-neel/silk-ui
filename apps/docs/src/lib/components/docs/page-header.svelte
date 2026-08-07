<script lang="ts">
    import { Badge } from '@sivir-ui/svelte/components/badge';

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
            <h1
                class={`m-0 max-w-[12ch] text-balance [font-family:var(--font-header),sans-serif] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)] leading-[1] ${
                    compact
                        ? 'text-[clamp(2rem,3vw,2.5rem)] md:max-w-[18ch]'
                        : 'text-[clamp(2.2rem,3.8vw,3rem)]'
                } max-md:max-w-none max-md:text-[clamp(1.6rem,7vw,2.2rem)]`}
            >
                {title}
            </h1>
            {#if description}
                <p
                    class="m-0 max-w-[46rem] text-balance text-[1rem] leading-[1.7] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted max-md:text-[0.98rem]"
                >
                    {description}
                </p>
            {/if}
        </div>
    </div>
</header>

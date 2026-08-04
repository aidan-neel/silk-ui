<script lang="ts">
import { cn } from '@sivir-ui/svelte/utils';
import { highlight } from '$lib/highlight';

let {
    code,
    class: classProp,
    lang = 'svelte',
    ...rest
}: { code: string; class?: string; lang?: string } = $props();

const html = $derived(highlight(code, lang));
</script>

<div
    {...rest}
    class={cn(
        classProp,
        'bg-background border border-border border-dashed rounded-[var(--radius-lg)] shadow-[var(--outline-shadow)] h-fit w-full overflow-hidden rounded-lg p-0 text-[14px]'
    )}
>
    <div class="w-full overflow-x-auto">
        <pre
            class="m-0 min-w-full overflow-x-auto rounded-[inherit] border-0 bg-transparent px-3 py-2.5 font-[var(--font-mono)] text-[12.5px] leading-[1.45]"><code
                >{@html html}</code
            ></pre>
    </div>
</div>

<script lang="ts">
import { cn } from '@sivir-ui/svelte/utils';
import type { BreadcrumbProps } from '.';

let { class: className, children, ...rest }: BreadcrumbProps = $props();
</script>

<div {...rest} class={cn(className, 'flex flex-row items-center gap-2')}>
    {@render children?.()}
</div>

<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TypographyHeadingProps } from './types';
    import { h1Classes } from './variants';

    let { children, class: className, ...rest }: TypographyHeadingProps = $props();
</script>

<h1 {...rest} data-ui="typography-h1" class={cn(className, h1Classes)}>
    {@render children?.()}
</h1>

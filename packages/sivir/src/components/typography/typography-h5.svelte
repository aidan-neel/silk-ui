<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TypographyHeadingProps } from './types';
    import { h5Classes } from './variants';

    let { children, class: className, ...rest }: TypographyHeadingProps = $props();
</script>

<h5 {...rest} data-ui="typography-h5" class={cn(className, h5Classes)}>
    {@render children?.()}
</h5>

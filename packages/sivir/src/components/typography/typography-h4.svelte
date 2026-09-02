<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TypographyHeadingProps } from './types';
    import { h4Classes } from './variants';

    let { children, class: className, ...rest }: TypographyHeadingProps = $props();
</script>

<h4 {...rest} data-ui="typography-h4" class={cn(className, h4Classes)}>
    {@render children?.()}
</h4>

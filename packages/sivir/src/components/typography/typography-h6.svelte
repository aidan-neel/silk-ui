<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TypographyHeadingProps } from './types';
    import { h6Classes } from './variants';

    let { children, class: className, ...rest }: TypographyHeadingProps = $props();
</script>

<h6 {...rest} data-ui="typography-h6" class={cn(className, h6Classes)}>
    {@render children?.()}
</h6>

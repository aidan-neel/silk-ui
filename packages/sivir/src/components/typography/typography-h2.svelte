<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TypographyHeadingProps } from './types';
    import { h2Classes } from './variants';

    let { children, class: className, ...rest }: TypographyHeadingProps = $props();
</script>

<h2 {...rest} data-ui="typography-h2" class={cn(className, h2Classes)}>
    {@render children?.()}
</h2>

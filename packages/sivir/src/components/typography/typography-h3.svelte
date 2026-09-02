<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TypographyHeadingProps } from './types';
    import { h3Classes } from './variants';

    let { children, class: className, ...rest }: TypographyHeadingProps = $props();
</script>

<h3 {...rest} data-ui="typography-h3" class={cn(className, h3Classes)}>
    {@render children?.()}
</h3>

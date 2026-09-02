<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TypographyInlineCodeProps } from './types';
    import { inlineCodeClasses } from './variants';

    let { children, class: className, ...rest }: TypographyInlineCodeProps = $props();
</script>

<code {...rest} data-ui="typography-inline-code" class={cn(className, inlineCodeClasses)}>
    {@render children?.()}
</code>

<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TypographyMetadataProps } from '.';
    import { metadataClasses } from './variants';

    let { children, class: className, ...rest }: TypographyMetadataProps = $props();
</script>

<span {...rest} data-ui="typography-metadata" class={cn(className, metadataClasses)}>
    {@render children?.()}
</span>

<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TypographyDescriptionProps } from '.';
    import { descriptionClasses } from './variants';

    let { children, class: className, ...rest }: TypographyDescriptionProps = $props();
</script>

<p {...rest} data-ui="typography-description" class={cn(className, descriptionClasses)}>
    {@render children?.()}
</p>

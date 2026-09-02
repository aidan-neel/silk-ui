<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TypographyTextProps } from './types';
    import { textClasses } from './variants';

    let {
        children,
        variant = 'supporting',
        class: className,
        ...rest
    }: TypographyTextProps = $props();
</script>

<p
    {...rest}
    data-ui="typography-text"
    data-variant={variant}
    class={cn(className, textClasses[variant])}
>
    {@render children?.()}
</p>

<script lang="ts">
    import { getModalContext } from '../modal/context.svelte';
    import { cn, type DefaultProps } from '@sivir-ui/svelte/utils';

    let { class: className, children, ...rest }: DefaultProps = $props();

    const modal = getModalContext();
</script>

<h1
    {...rest}
    id={modal.id + '-title'}
    class={cn(
        className,
        'text-center [font-family:var(--font-header)] [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)] text-balance sm:text-left'
    )}
>
    {@render children?.()}
</h1>

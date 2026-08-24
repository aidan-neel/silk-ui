<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ModalTitleProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, ...rest }: ModalTitleProps = $props();

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

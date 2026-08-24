<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ModalDescriptionProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, ...rest }: ModalDescriptionProps = $props();

    const modal = getModalContext();
</script>

<p
    {...rest}
    id={modal.id + '-desc'}
    class={cn(
        className,
        'text-center [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-pretty text-foreground-muted sm:text-left'
    )}
>
    {@render children?.()}
</p>

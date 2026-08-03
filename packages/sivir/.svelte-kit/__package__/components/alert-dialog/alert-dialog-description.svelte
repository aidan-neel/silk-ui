<script lang="ts">
    import { getModalContext } from '../modal/context.svelte';
    import { cn, type DefaultProps } from '@sivir-ui/svelte/utils';

    let { class: className, children, ...rest }: DefaultProps = $props();

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

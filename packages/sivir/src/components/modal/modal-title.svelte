<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ModalTitleProps } from '.';
    import { getModalContext } from './context.svelte';

    let { class: className, children, ...rest }: ModalTitleProps = $props();

    const modal = getModalContext();
</script>

<h1
    {...rest}
    id={`${modal.id}-title`}
    class={cn(
        className,
        'font-[family-name:var(--font-header)] text-xl font-[var(--font-weight-header,600)] tracking-[var(--tracking-header,-0.02em)] leading-snug text-balance text-foreground'
    )}
>
    {@render children?.()}
</h1>

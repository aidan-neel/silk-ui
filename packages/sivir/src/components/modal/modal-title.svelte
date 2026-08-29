<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { titleClasses } from '../typography/variants';
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
        'text-center sm:text-left',
        titleClasses
    )}
>
    {@render children?.()}
</h1>

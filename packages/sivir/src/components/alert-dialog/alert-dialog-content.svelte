<script lang="ts">
    import * as Modal from '@sivir-ui/svelte/components/modal';
    import { cn, type DefaultProps } from '@sivir-ui/svelte/utils';

    type Props = {
        allowClickOutside?: boolean;
        allowEscape?: boolean;
        ariaBusy?: boolean;
        /** Max-width preset. Defaults to `md`. */
        size?: 'sm' | 'md' | 'lg' | 'xl';
        /** Show the top-right close (X) button. Defaults to `true`. */
        showClose?: boolean;
    } & DefaultProps;

    let {
        class: className,
        allowClickOutside = false,
        allowEscape = true,
        ariaBusy,
        size = 'md',
        showClose = true,
        children,
        ...rest
    }: Props = $props();

    const maxWidthClass = $derived(
        (
            {
                // token-lint-disable-next-line no-literal-length
                sm: 'md:max-w-[18rem]',
                md: 'md:max-w-xs',
                lg: 'md:max-w-md',
                xl: 'md:max-w-xl'
            } as const
        )[size]
    );
</script>

<Modal.Content
    {allowClickOutside}
    {allowEscape}
    {maxWidthClass}
    {size}
    {showClose}
    role="alertdialog"
    panelIdPrefix="alert-dialog"
    data-ui="alert-dialog-content"
    aria-busy={ariaBusy}
    class={cn(className, 'rounded-[var(--radius-xl)]')}
    {...rest}
>
    {@render children?.()}
</Modal.Content>

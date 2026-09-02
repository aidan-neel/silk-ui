<script lang="ts">
    import { cn, type DefaultProps } from '@sivir-ui/svelte/utils';
    import { getModalContext } from '../modal/context.svelte';

    let { class: className, children, ...rest }: DefaultProps = $props();

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

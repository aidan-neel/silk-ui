<script lang="ts">
    import * as Popover from '@sivir-ui/svelte/components/popover';
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { Placement } from '../popover';
    import type { HoverCardContentProps } from '.';

    const hoverCard = getContext<{ setPlacement: (next: Placement) => void }>('sivir-hover-card');

    let { class: className, children, side, align, ...rest }: HoverCardContentProps = $props();

    $effect(() => {
        if (side === undefined && align === undefined) {
            return;
        }
        const resolvedSide = side ?? 'bottom';
        const resolvedAlign = align ?? 'center';
        hoverCard?.setPlacement(
            (resolvedAlign === 'center'
                ? resolvedSide
                : `${resolvedSide}-${resolvedAlign}`) as Placement
        );
    });
</script>

<Popover.Content
    role="dialog"
    aria-modal="false"
    allowClickOutside={false}
    {...rest}
    class={cn(className, 'w-64 text-[var(--font-size-body)]')}
    surfaceClass="p-3"
>
    {@render children?.()}
</Popover.Content>

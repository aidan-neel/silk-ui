<script lang="ts">
    import Check from '@lucide/svelte/icons/circle-check';
    import X from '@lucide/svelte/icons/circle-x';
    import Info from '@lucide/svelte/icons/info';
    import Warning from '@lucide/svelte/icons/triangle-alert';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Snippet } from 'svelte';
    import { alert, alertIcon } from './variants';

    type Variant = 'info' | 'error' | 'success' | 'warning';

    let {
        variant = 'info',
        children,
        class: classProp,
        ...rest
    }: {
        variant?: Variant;
        children: Snippet;
        class?: string;
    } = $props();

    const Icon = $derived(
        variant === 'success'
            ? Check
            : variant === 'error'
              ? X
              : variant === 'warning'
                ? Warning
                : Info
    );
</script>

<div role="alert" {...rest} class={cn(classProp, alert())}>
    <Icon class={alertIcon({ variant })} size={16} strokeWidth={2.25} aria-hidden="true" />
    <div class="flex min-w-0 flex-1 flex-col gap-0.5">
        {@render children?.()}
    </div>
</div>

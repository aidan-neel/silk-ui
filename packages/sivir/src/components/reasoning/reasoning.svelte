<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ReasoningRootProps } from '.';
    import { setReasoningContext } from './context.svelte';

    let {
        streaming = false,
        open = $bindable(true),
        onOpenChange,
        onOpenChangeComplete,
        children,
        class: className,
        ...rest
    }: ReasoningRootProps = $props();

    const id = $props.id();
    let contentRegistered = false;
    let initialized = false;
    let previousOpen = open;
    let revision = 0;
    let pending: { open: boolean; revision: number } | undefined;

    const reasoning = {
        id,
        get open() {
            return open;
        },
        set open(value) {
            open = value;
        },
        get streaming() {
            return streaming;
        },
        registerContent() {
            if (contentRegistered) {
                throw new Error('Reasoning.Root supports exactly one Reasoning.Content.');
            }
            contentRegistered = true;
            return () => {
                contentRegistered = false;
            };
        },
        transitionStart(nextOpen: boolean) {
            if (pending?.open === nextOpen) {
                return pending.revision;
            }
            return revision;
        },
        transitionComplete(nextOpen: boolean, completedRevision: number) {
            if (pending?.open !== nextOpen || pending.revision !== completedRevision) {
                return;
            }
            pending = undefined;
            if (nextOpen) {
                onOpenChangeComplete?.(true);
                return;
            }
            queueMicrotask(() => {
                if (!pending) {
                    onOpenChangeComplete?.(false);
                }
            });
        }
    };

    setReasoningContext(reasoning);

    $effect(() => {
        if (!initialized) {
            initialized = true;
            previousOpen = open;
            return;
        }
        if (open === previousOpen) {
            return;
        }
        previousOpen = open;
        revision += 1;
        pending = { open, revision };
        onOpenChange?.(open);
        if (!contentRegistered) {
            const completion = pending;
            queueMicrotask(() => {
                if (pending === completion) {
                    reasoning.transitionComplete(completion.open, completion.revision);
                }
            });
        }
    });
</script>

<section
    data-ui="reasoning"
    data-streaming={streaming}
    aria-busy={streaming}
    class={cn(className, 'w-full max-w-full text-sm text-foreground')}
    {...rest}
>
    {@render children?.()}
</section>

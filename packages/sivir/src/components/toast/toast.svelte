<!-- token-lint-disable-file -->
<script lang="ts">
    import Check from '@lucide/svelte/icons/circle-check';
    import CircleX from '@lucide/svelte/icons/circle-x';
    import Info from '@lucide/svelte/icons/info';
    import Loader from '@lucide/svelte/icons/loader-circle';
    import Warning from '@lucide/svelte/icons/triangle-alert';
    import X from '@lucide/svelte/icons/x';
    import Button from '@sivir-ui/svelte/components/button';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { Toast } from './lib.svelte';
    import { dismissToast, pauseToast, resumeToast } from './lib.svelte';
    import { toastIcon, toastProgress } from './variants';

    const { toast }: { toast: Toast } = $props();

    const Icon = $derived.by(() => {
        if (toast.type === 'success') {
            return Check;
        }

        if (toast.type === 'error') {
            return CircleX;
        }

        if (toast.type === 'warning') {
            return Warning;
        }

        if (toast.type === 'loading') {
            return Loader;
        }

        if (toast.type === 'info') {
            return Info;
        }

        return null;
    });

    const iconColorClass = $derived(toastIcon({ type: toast.type }));
    const progressColorClass = $derived(toastProgress({ type: toast.type }));
</script>

<div
    data-ui="toast"
    role="alert"
    aria-live="polite"
    aria-atomic="true"
    class={cn(
        'group relative flex w-full flex-col overflow-hidden',
        'rounded-[calc(var(--radius-lg)+0.15rem)] border border-border',
        'bg-panel shadow-[var(--elevation-float)] backdrop-blur-[14px]',
        'ring-1 ring-black/4 sm:ring-0',
        'text-foreground'
    )}
    onmouseenter={() => {
        if (toast.id !== undefined) {
            pauseToast(toast.id);
        }
    }}
    onmouseleave={() => {
        if (toast.id !== undefined) {
            resumeToast(toast.id);
        }
    }}
>
    <div class="flex items-start gap-3 p-4">
        {#if Icon}
            <div
                class={cn(
                    'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md',
                    iconColorClass
                )}
            >
                <Icon
                    size="13"
                    class={toast.type === 'loading'
                        ? 'animate-spin motion-reduce:animate-none'
                        : ''}
                />
            </div>
        {/if}

        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <p
                class="[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] leading-snug tracking-[-0.015em] text-foreground"
            >
                {toast.title}
            </p>
            {#if toast.description}
                <p
                    class="[font-size:var(--font-size-body,16px)] leading-[1.45] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
                >
                    {toast.description}
                </p>
            {/if}

            {#if toast.actions?.length}
                <div class="mt-1.5 flex flex-row flex-wrap items-center gap-4">
                    {#each toast.actions as action, i (i)}
                        <Button
                            variant={action.variant ?? 'ghost'}
                            size="sm"
                            class={cn(
                                '!h-auto min-h-0 rounded-[var(--radius-sm)] !bg-transparent px-0 py-0 [font-size:var(--font-size-label)] [font-weight:var(--font-weight-button,600)] underline-offset-2 hover:!bg-transparent hover:underline',
                                i === 0
                                    ? 'text-[var(--color-primary)] hover:text-[var(--color-primary)]'
                                    : 'text-foreground-muted hover:text-foreground'
                            )}
                            onclick={() => {
                                action.callback();
                                if (toast.id !== undefined) {
                                    dismissToast(toast.id);
                                }
                            }}
                        >
                            {action.label}
                        </Button>
                    {/each}
                </div>
            {/if}
        </div>

        {#if toast.exitable && toast.id !== undefined}
            <button
                type="button"
                onclick={() => dismissToast(toast.id!)}
                class={cn(
                    'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md',
                    'text-foreground-muted opacity-0 transition-[opacity,background-color,color] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-out)] motion-reduce:transition-none',
                    'hover:bg-secondary/50 hover:text-foreground',
                    'group-hover:opacity-100'
                )}
                aria-label="Dismiss notification"
            >
                <X size="13" />
            </button>
        {/if}
    </div>

    {#if !toast.persistent && toast.duration}
        <div
            class={cn(
                'absolute bottom-0 left-0 h-[2px] w-full origin-left opacity-40',
                'animate-[sivir-toast-progress_linear_forwards] motion-reduce:animate-none',
                toast.paused ? '[animation-play-state:paused]' : '[animation-play-state:running]',
                progressColorClass
            )}
            style:animation-duration={`${toast.duration}ms`}
        ></div>
    {/if}
</div>

<style>
    :global {
        @keyframes sivir-toast-progress {
            from {
                transform: scaleX(1);
            }
            to {
                transform: scaleX(0);
            }
        }
    }
</style>

<script lang="ts">
    import { cn, pressable } from '@sivir-ui/svelte/utils';
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
    import type { ButtonProps } from '.';
    import { button } from './variants';

    let {
        href,
        variant = 'primary',
        children,
        class: classProp,
        size = 'md',
        element = $bindable(),
        unstyled = false,
        status,
        loading,
        loadingLabel,
        successLabel,
        errorLabel,
        'aria-label': ariaLabel,
        'aria-disabled': ariaDisabled,
        onclick,
        ...rest
    }: ButtonProps = $props();

    const classes = $derived(cn(classProp, unstyled ? undefined : button({ variant, size })));
    const visualStatus = $derived(status ?? (loading ? 'loading' : 'idle'));
    const statusClasses = $derived(
        unstyled
            ? undefined
            : visualStatus === 'success'
              ? 'bg-[color-mix(in_srgb,var(--color-success)_12%,var(--color-card))] text-[var(--color-success)] hover:bg-[color-mix(in_srgb,var(--color-success)_18%,var(--color-card))] data-[state=open]:bg-[color-mix(in_srgb,var(--color-success)_18%,var(--color-card))]'
              : visualStatus === 'error'
                ? 'bg-[color-mix(in_srgb,var(--color-error)_12%,var(--color-card))] text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_18%,var(--color-card))] data-[state=open]:bg-[color-mix(in_srgb,var(--color-error)_18%,var(--color-card))]'
                : undefined
    );
    const styledClasses = $derived(cn(classes, statusClasses));
    const stateful = $derived(
        status !== undefined ||
            loading !== undefined ||
            loadingLabel !== undefined ||
            successLabel !== undefined ||
            errorLabel !== undefined
    );
    const pending = $derived(visualStatus === 'loading');
    const currentLabel = $derived(
        visualStatus === 'loading'
            ? (loadingLabel ?? 'Loading…')
            : visualStatus === 'success'
              ? (successLabel ?? 'Done')
              : visualStatus === 'error'
                ? (errorLabel ?? 'Try again')
                : ariaLabel
    );

    function activate(event: MouseEvent) {
        if (pending) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        onclick?.(event);
    }
</script>

{#snippet content()}
    {#if stateful}
        <span class="relative grid place-items-center">
            <span
                class="sivir-button-face col-start-1 row-start-1 flex items-center justify-center gap-1.5"
                data-active={visualStatus === 'idle'}
                aria-hidden={visualStatus !== 'idle'}
            >
                {@render children?.()}
            </span>
            <span
                class="sivir-button-face col-start-1 row-start-1 flex items-center justify-center gap-1.5 text-current/75"
                data-active={visualStatus === 'loading'}
                aria-hidden={visualStatus !== 'loading'}
            >
                <svg
                    class="sivir-button-spinner size-3"
                    data-spinning={visualStatus === 'loading'}
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle
                        cx="6"
                        cy="6"
                        r="4.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        opacity="0.22"
                    />
                    <path
                        d="M10.5 6A4.5 4.5 0 0 0 6 1.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                </svg>
                {loadingLabel ?? 'Loading…'}
            </span>
            <span
                class="sivir-button-face col-start-1 row-start-1 flex items-center justify-center gap-1.5"
                data-active={visualStatus === 'success'}
                aria-hidden={visualStatus !== 'success'}
            >
                <svg class="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                        d="M2.6 6.3 4.9 8.6 9.4 3.6"
                        stroke="currentColor"
                        stroke-width="1.7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                {successLabel ?? 'Done'}
            </span>
            <span
                class="sivir-button-face col-start-1 row-start-1 flex items-center justify-center gap-1.5"
                data-active={visualStatus === 'error'}
                aria-hidden={visualStatus !== 'error'}
            >
                <svg class="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                        d="M6 2.9v3.5M6 9.05h.01"
                        stroke="currentColor"
                        stroke-width="1.7"
                        stroke-linecap="round"
                    />
                </svg>
                {errorLabel ?? 'Try again'}
            </span>
        </span>
    {:else}
        {@render children?.()}
    {/if}
{/snippet}

{#if href}
    <a
        bind:this={element as HTMLAnchorElement}
        use:pressable
        href={pending ? undefined : href}
        role={pending ? 'link' : undefined}
        tabindex={pending ? 0 : (rest as HTMLAnchorAttributes).tabindex}
        data-ui="button"
        data-variant={variant}
        data-size={size}
        class={styledClasses}
        aria-label={currentLabel}
        aria-busy={pending || undefined}
        aria-disabled={pending || ariaDisabled}
        onclick={activate}
        onkeydown={(e) => {
            if (
                (e.code === 'Space' || e.key === ' ') &&
                e.currentTarget.matches(':focus-visible')
            ) {
                e.preventDefault();
                e.currentTarget.click();
            }
        }}
        {...rest as HTMLAnchorAttributes}
    >
        {@render content()}
    </a>
{:else}
    <button
        bind:this={element as HTMLButtonElement}
        use:pressable
        type={(rest as HTMLButtonAttributes).type ?? 'button'}
        data-ui="button"
        data-variant={variant}
        data-size={size}
        class={styledClasses}
        aria-label={currentLabel}
        aria-busy={pending || undefined}
        aria-disabled={pending || ariaDisabled}
        onclick={activate}
        {...rest as HTMLButtonAttributes}
    >
        {@render content()}
    </button>
{/if}

{#if stateful}
    <span role="status" aria-live="polite" class="sr-only">
        {visualStatus === 'success'
            ? (successLabel ?? 'Done')
            : visualStatus === 'error'
              ? (errorLabel ?? 'Try again')
              : ''}
    </span>
{/if}

<style>
    .sivir-button-face {
        transition-property: opacity, translate, filter;
        transition-duration: var(--motion-duration-panel);
        transition-timing-function: var(--ease-out);
    }

    .sivir-button-face[data-active='false'] {
        pointer-events: none;
        opacity: 0;
        translate: 0 3px;
        filter: blur(3px);
    }

    .sivir-button-face[data-active='true'] {
        opacity: 1;
        translate: 0 0;
        filter: blur(0);
    }

    .sivir-button-spinner {
        animation: sivir-button-spin 850ms linear infinite;
        animation-play-state: paused;
    }

    .sivir-button-spinner[data-spinning='true'] {
        animation-play-state: running;
    }

    @keyframes sivir-button-spin {
        to {
            rotate: 360deg;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .sivir-button-face {
            transition: none;
        }

        .sivir-button-spinner {
            animation: none;
        }
    }
</style>

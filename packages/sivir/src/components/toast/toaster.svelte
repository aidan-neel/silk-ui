<!-- token-lint-disable-file -->
<script lang="ts">
    import { getCssDuration } from '@sivir-ui/svelte/transition';
    import { visualViewportBounds } from '@sivir-ui/svelte/utils';
    import { cubicOut, quartOut } from 'svelte/easing';
    import type { TransitionConfig } from 'svelte/transition';
    import { getToastPrimaryHostId, setToastUIState } from './lib.svelte';
    import Toast from './toast.svelte';

    const { state: toastState, hostId } = setToastUIState();
    const isPrimary = $derived(getToastPrimaryHostId() === hostId);

    let expanded = $state(false);
    let heights = $state<Record<number, number>>({} as Record<number, number>);
    let portalEl = $state<HTMLDivElement>();

    /**
     * Portal to `<body>` so `position: fixed` stays viewport-relative even when a
     * Toaster is mounted under transformed or overflow-clipped ancestors, as in
     * docs previews and nested page hosts.
     */
    $effect(() => {
        if (!portalEl || typeof document === 'undefined') {
            return;
        }
        document.body.appendChild(portalEl);
        return () => {
            portalEl?.remove();
        };
    });

    const COLLAPSED_OFFSET = 14;
    const COLLAPSED_SCALE_STEP = 0.05;
    const COLLAPSED_OPACITY_STEP = 0.16;
    const MAX_VISIBLE = 3;
    const EXPANDED_GAP = 10;

    const reversedToasts = $derived([...toastState.data.toasts].reverse());

    function getExpandedY(index: number): number {
        let y = 0;
        for (let i = 0; i < index; i++) {
            const t = reversedToasts[i];
            y += (t?.id !== undefined ? (heights[t.id] ?? 72) : 72) + EXPANDED_GAP;
        }
        return y;
    }

    function getTransform(index: number): string {
        const y = expanded ? getExpandedY(index) : index * COLLAPSED_OFFSET;
        const scale = expanded ? 1 : Math.max(1 - index * COLLAPSED_SCALE_STEP, 0.8);
        return `translateY(-${y}px) scale(${scale})`;
    }

    function getOpacity(index: number): number {
        if (expanded) {
            return 1;
        }
        if (index >= MAX_VISIBLE) {
            return 0;
        }
        return Math.max(1 - index * COLLAPSED_OPACITY_STEP, 0);
    }

    const containerHeight = $derived.by(() => {
        const n = reversedToasts.length;
        if (n === 0) {
            return 0;
        }
        if (expanded) {
            return reversedToasts.reduce((sum, t, i) => {
                const h = t?.id !== undefined ? (heights[t.id] ?? 72) : 72;
                return sum + h + (i < n - 1 ? EXPANDED_GAP : 0);
            }, 0);
        }
        const newestId = reversedToasts[0]?.id;
        const newestHeight = newestId !== undefined ? (heights[newestId] ?? 72) : 72;
        return newestHeight + (Math.min(n, MAX_VISIBLE) - 1) * COLLAPSED_OFFSET;
    });

    function toastIn(node: Element): TransitionConfig {
        const duration = getCssDuration(node, '--motion-duration-toast-in', 440);
        return {
            duration,
            easing: quartOut,
            css: (t: number) => {
                return `
					opacity: ${t};
					transform: translateY(${(1 - t) * 16}px) scale(${0.985 + t * 0.015});
				`;
            }
        };
    }

    function toastOut(node: Element): TransitionConfig {
        const duration = getCssDuration(node, '--motion-duration-toast-out', 340);
        return {
            duration,
            easing: cubicOut,
            css: (t: number) => {
                return `
					opacity: ${t};
					transform: translateY(${(1 - t) * 12}px) scale(${0.985 + t * 0.015});
				`;
            }
        };
    }
</script>

{#if isPrimary && toastState.data}
    <div
        bind:this={portalEl}
        use:visualViewportBounds
        class="pointer-events-none fixed inset-x-0 top-[var(--sivir-viewport-top)] z-200 flex h-[var(--sivir-viewport-height)] items-end justify-center px-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:justify-end sm:p-6"
    >
        <div
            role="region"
            aria-label="Notifications"
            class="pointer-events-auto relative w-full max-w-[min(100%,26rem)] transition-[height] duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-w-90"
            style:height={`${containerHeight}px`}
            onmouseenter={() => (expanded = true)}
            onmouseleave={() => (expanded = false)}
        >
            {#each reversedToasts as toast, i (toast.id)}
                <!--
					Stacking wrapper: only CSS transitions, NO Svelte in/out.
					Owns the position/scale/opacity for the stack effect.
				-->
                <div
                    class="absolute bottom-0 w-full transition-[transform,opacity] [transition-duration:460ms,340ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1),ease] will-change-transform"
                    style:transform={getTransform(i)}
                    style:opacity={getOpacity(i)}
                    style:z-index={reversedToasts.length - i}
                    style:pointer-events={i < MAX_VISIBLE || expanded ? 'auto' : 'none'}
                    bind:clientHeight={heights[toast.id!]}
                >
                    <!--
						Transition wrapper: only Svelte in/out, NO CSS transform transitions.
						Enter slides up + fade. Exit slides right + fade.
						Completely independent of the stacking layer above.
					-->
                    <div in:toastIn|global out:toastOut|global>
                        <Toast {toast} />
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}

<script lang="ts" generics="T">
    import { flip } from 'svelte/animate';
    import { cubicOut } from 'svelte/easing';
    import { tick, untrack } from 'svelte';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ReorderListProps } from '.';

    let {
        items = $bindable(),
        getId,
        getLabel,
        children,
        label,
        disabled = false,
        onReorder,
        onCommit,
        class: className,
        ...rest
    }: ReorderListProps<T> = $props();
    const uid = $props.id();

    let listElement = $state<HTMLOListElement>();
    let grabbed = $state<string>();
    let dragging = $state<string>();
    let spoken = $state('');
    let reduced = $state(false);
    let snapshot: T[] | undefined;
    let pointerSession:
        | {
              id: string;
              node: HTMLButtonElement;
              pointerId: number;
              startY: number;
              currentY: number;
              startLayoutTop: number;
              grabOffset: number;
              centers: { id: string; center: number }[];
          }
        | undefined;
    const dragThreshold = 5;

    $effect(() => {
        if (typeof window.matchMedia !== 'function') {
            return;
        }
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => {
            reduced = query.matches;
        };
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    });

    $effect(() => {
        if (disabled) {
            untrack(cancelInterruptedGesture);
        }
    });

    function moveItem(list: T[], from: number, to: number) {
        const next = [...list];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        return next;
    }

    function emit(next: T[]) {
        items = next;
        onReorder?.(next);
    }

    function indexOf(id: string) {
        return items.findIndex((item) => getId(item) === id);
    }

    function announcePosition(id: string) {
        const index = indexOf(id);
        if (index < 0) {
            return;
        }
        const item = items[index];
        spoken = `${getLabel(item)}, position ${index + 1} of ${items.length}.`;
    }

    function announceDrop(id: string) {
        const index = indexOf(id);
        if (index < 0) {
            return;
        }
        const item = items[index];
        spoken = `${getLabel(item)} dropped at position ${index + 1}.`;
    }

    function grab(id: string) {
        if (disabled || pointerSession) {
            return;
        }
        snapshot = [...items];
        grabbed = id;
        const index = indexOf(id);
        if (index < 0) {
            return;
        }
        const item = items[index];
        spoken = `${getLabel(item)} grabbed, position ${index + 1} of ${items.length}.`;
    }

    function drop(id: string) {
        grabbed = undefined;
        snapshot = undefined;
        announceDrop(id);
        onCommit?.([...items]);
    }

    function clearPointerSession() {
        const session = pointerSession;
        pointerSession = undefined;
        if (!session) {
            return;
        }
        if (listElement?.hasPointerCapture?.(session.pointerId)) {
            listElement.releasePointerCapture?.(session.pointerId);
        }
        session.node.style.translate = '';
        session.node.style.removeProperty('will-change');
    }

    function cancel() {
        if (!snapshot) {
            return;
        }
        const original = snapshot;
        const active = Boolean(dragging || grabbed);
        snapshot = undefined;
        grabbed = undefined;
        dragging = undefined;
        clearPointerSession();
        if (active) {
            emit(original);
            spoken = 'Reorder cancelled, original order restored.';
        }
    }

    function step(id: string, delta: -1 | 1) {
        const from = indexOf(id);
        const to = from + delta;
        if (from < 0 || to < 0 || to >= items.length) {
            return;
        }
        emit(moveItem(items, from, to));
        announcePosition(id);
        void tick().then(() => {
            const row = Array.from(
                listElement?.querySelectorAll<HTMLButtonElement>('[data-reorder-id]') ?? []
            ).find((candidate) => candidate.dataset.reorderId === id);
            row?.focus({ preventScroll: true });
        });
    }

    function onRowKeydown(event: KeyboardEvent, id: string) {
        if (disabled || event.target !== event.currentTarget) {
            return;
        }
        const held = grabbed === id;
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            if (held) {
                drop(id);
            } else {
                grab(id);
            }
            return;
        }
        if (held && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
            event.preventDefault();
            step(id, event.key === 'ArrowUp' ? -1 : 1);
            return;
        }
        if (held && event.key === 'Escape') {
            event.preventDefault();
            cancel();
        }
    }

    function startPointer(event: PointerEvent, id: string) {
        if (disabled || grabbed || pointerSession || event.button !== 0) {
            return;
        }
        const node = event.currentTarget as HTMLButtonElement;
        snapshot = [...items];
        const rect = node.getBoundingClientRect();
        const row = node.parentElement;
        pointerSession = {
            id,
            node,
            pointerId: event.pointerId,
            startY: event.clientY,
            currentY: event.clientY,
            startLayoutTop: row?.offsetTop ?? 0,
            grabOffset: event.clientY - rect.top,
            centers: Array.from(
                listElement?.querySelectorAll<HTMLButtonElement>('[data-reorder-id]') ?? []
            ).map((candidate) => {
                const candidateRect = candidate.getBoundingClientRect();
                return {
                    id: candidate.dataset.reorderId ?? '',
                    center: candidateRect.top + candidateRect.height / 2
                };
            })
        };
        listElement?.setPointerCapture?.(event.pointerId);
    }

    function positionDraggedRow(session: NonNullable<typeof pointerSession>) {
        const layoutDelta = (session.node.parentElement?.offsetTop ?? 0) - session.startLayoutTop;
        session.node.style.translate = `0 ${session.currentY - session.startY - layoutDelta}px`;
    }

    function movePointer(event: PointerEvent) {
        const session = pointerSession;
        if (!session || session.pointerId !== event.pointerId || !listElement) {
            return;
        }
        if (disabled) {
            cancel();
            return;
        }
        if (!dragging) {
            if (Math.abs(event.clientY - session.startY) < dragThreshold) {
                return;
            }
            dragging = session.id;
            session.node.style.setProperty('will-change', 'translate');
        }
        if (dragging !== session.id) {
            return;
        }
        session.currentY = event.clientY;
        positionDraggedRow(session);

        const from = indexOf(session.id);
        const pointerCenter = event.clientY + (session.node.offsetHeight / 2 - session.grabOffset);
        const to = session.centers
            .filter((entry) => entry.id !== session.id)
            .filter((entry) => pointerCenter > entry.center).length;
        if (from >= 0 && to !== from) {
            emit(moveItem(items, from, to));
            void tick().then(() => {
                if (pointerSession === session) {
                    positionDraggedRow(session);
                }
            });
        }
    }

    function finishPointer(event: PointerEvent) {
        const session = pointerSession;
        if (!session || session.pointerId !== event.pointerId) {
            return;
        }
        if (disabled) {
            cancel();
            return;
        }
        const moved = dragging === session.id;
        dragging = undefined;
        snapshot = undefined;
        clearPointerSession();
        if (moved) {
            announceDrop(session.id);
            onCommit?.([...items]);
        }
    }

    function cancelPointer(event: PointerEvent) {
        if (pointerSession?.pointerId === event.pointerId) {
            cancel();
        }
    }

    function cancelInterruptedGesture() {
        if (pointerSession || dragging || grabbed) {
            cancel();
        }
    }
</script>

<svelte:window
    onpointermove={movePointer}
    onpointerup={finishPointer}
    onpointercancel={cancelPointer}
    onblur={cancelInterruptedGesture}
/>
<svelte:document
    onvisibilitychange={() => {
        if (document.hidden) {
            cancelInterruptedGesture();
        }
    }}
/>

<div {...rest} data-ui="reorder-list" class={cn(className, 'w-full')}>
    <ol
        bind:this={listElement}
        aria-label={label}
        onlostpointercapture={cancelPointer}
        class="m-0 list-none space-y-1.5 p-0"
    >
        {#each items as item (getId(item))}
            {@const id = getId(item)}
            {@const held = grabbed === id}
            {@const lifted = held || dragging === id}
            <li animate:flip={{ duration: reduced || lifted ? 0 : 180, easing: cubicOut }}>
                <button
                    type="button"
                    data-reorder-id={id}
                    data-lifted={lifted}
                    aria-pressed={held}
                    aria-describedby={`${uid}-hint`}
                    {disabled}
                    onkeydown={(event) => onRowKeydown(event, id)}
                    onpointerdown={(event) => startPointer(event, id)}
                    onblur={() => {
                        if (held) {
                            cancel();
                        }
                    }}
                    class={cn(
                        'relative flex w-full touch-pan-x select-none items-center gap-2.5 rounded-[var(--radius-lg)] border border-border bg-card px-3 py-2.5 text-left text-foreground outline-none transition-[background-color,border-color,box-shadow,translate] [transition-duration:var(--motion-duration-item)] ease-[var(--ease-out)]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        // token-lint-disable-next-line no-literal-length
                        'focus-visible:bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--color-card))] focus-visible:shadow-[inset_0_0_0_1px_var(--color-primary)]',
                        lifted
                            ? 'z-10 cursor-grabbing border-primary/45 shadow-[var(--elevation-float)]'
                            : 'cursor-grab shadow-[var(--elevation-1)]'
                    )}
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 10 14"
                        class="h-3.5 w-2.5 shrink-0 fill-current text-foreground-muted/55"
                    >
                        <circle cx="2.5" cy="2.5" r="1.2" /><circle cx="7.5" cy="2.5" r="1.2" />
                        <circle cx="2.5" cy="7" r="1.2" /><circle cx="7.5" cy="7" r="1.2" />
                        <circle cx="2.5" cy="11.5" r="1.2" /><circle cx="7.5" cy="11.5" r="1.2" />
                    </svg>
                    <span class="sr-only">{getLabel(item)}</span>
                    <span aria-hidden="true" class="min-w-0 flex-1">
                        {@render children(item)}
                    </span>
                </button>
            </li>
        {/each}
    </ol>
    <span id={`${uid}-hint`} class="sr-only">
        Drag to reorder. With the keyboard, Space or Enter grabs the row, the arrow keys move it,
        Space or Enter drops it, and Escape restores the original order.
    </span>
    <span role="status" aria-live="polite" class="sr-only">{spoken}</span>
</div>

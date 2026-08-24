<script lang="ts">
    import type { VirtualElement } from '@floating-ui/dom';
    import type { ContextMenuTriggerProps } from '.';
    import { getContextMenuContext } from './context.svelte';

    const { state: contextMenuState } = getContextMenuContext();

    let { class: className, children, ...rest }: ContextMenuTriggerProps = $props();

    function makeVirtualEl(x: number, y: number): VirtualElement {
        return {
            getBoundingClientRect: () =>
                ({
                    x,
                    y,
                    top: y,
                    left: x,
                    right: x,
                    bottom: y,
                    width: 0,
                    height: 0
                }) as DOMRect
        };
    }

    function onContextMenu(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const el = makeVirtualEl(e.clientX, e.clientY);
        if (contextMenuState.open) {
            contextMenuState.virtualElement = el;
            return;
        }
        contextMenuState.virtualElement = el;
        contextMenuState.open = true;
    }

    function onKeydown(e: KeyboardEvent) {
        if (e.key !== 'ContextMenu' && !(e.shiftKey && e.key === 'F10')) {
            return;
        }
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const el = makeVirtualEl(rect.left, rect.bottom);
        if (contextMenuState.open) {
            contextMenuState.virtualElement = el;
            return;
        }
        contextMenuState.virtualElement = el;
        contextMenuState.open = true;
    }

    function onPointerup(e: PointerEvent) {
        if (e.pointerType !== 'touch') {
            return;
        }
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const el = makeVirtualEl(
            e.clientX || rect.left + rect.width / 2,
            e.clientY || rect.top + rect.height / 2
        );
        if (contextMenuState.open) {
            contextMenuState.virtualElement = el;
            return;
        }
        contextMenuState.virtualElement = el;
        contextMenuState.open = true;
    }
</script>

<div
    class={className}
    {...rest}
    role="button"
    tabindex="0"
    aria-haspopup="menu"
    aria-expanded={contextMenuState.open}
    oncontextmenu={onContextMenu}
    onkeydown={onKeydown}
    onpointerup={onPointerup}
>
    {@render children?.()}
</div>

<script lang="ts">
import Check from '@lucide/svelte/icons/check';
import { Button } from '@sivir-ui/svelte/components/button';
import { closeMenuLayers, cn } from '@sivir-ui/svelte/utils';
import { untrack } from 'svelte';
import { type ContextMenuCheckboxItemProps } from '.';
import { getContextMenuContext } from './context.svelte';

const { state: contextMenuState, ancestors } = getContextMenuContext();

let {
    class: className,
    children,
    value,
    checked = $bindable(false),
    callback,
    inset = false,
    ...rest
}: ContextMenuCheckboxItemProps = $props();

let internalChecked = $state(untrack(() => contextMenuState.checkboxItems.get(value) ?? checked));
let syncedChecked = $state(untrack(() => internalChecked));
untrack(() => contextMenuState.checkboxItems.set(value, internalChecked));

$effect(() => {
    if (checked !== syncedChecked) {
        syncedChecked = checked;
        internalChecked = checked;
    }
});
$effect(() => {
    contextMenuState.checkboxItems.set(value, internalChecked);
    if (internalChecked !== syncedChecked) {
        syncedChecked = internalChecked;
        checked = syncedChecked;
    }
});

function toggle() {
    internalChecked = !internalChecked;
    closeMenuLayers(contextMenuState, ancestors);
    callback?.();
}
</script>

<Button
    {...rest}
    role="menuitemcheckbox"
    aria-checked={internalChecked}
    data-collection-item
    onclick={toggle}
    class={cn(className, 'sivir-menu-item relative', inset && 'pl-8')}
    unstyled
>
    <div class="absolute left-2 h-4 w-4">
        {#if internalChecked}
            <Check class="text-foreground" />
        {/if}
    </div>
    {@render children?.()}
</Button>

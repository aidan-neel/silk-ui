<script lang="ts">
import { panelIn, panelOut } from '@sivir-ui/svelte/transition';
import { cn } from '@sivir-ui/svelte/utils';
import type { AttachmentListProps } from '.';
import Item from './attachment-item.svelte';
import { getAttachmentContext } from './context.svelte';

let {
    label = 'Attachments',
    class: className,
    'aria-label': ariaLabel,
    ...rest
}: AttachmentListProps = $props();

const context = getAttachmentContext();
</script>

{#if context.files.length > 0}
    <ul
        {...rest}
        data-ui="attachment-list"
        data-state="populated"
        aria-label={ariaLabel ?? label}
        class={cn(className, 'flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap')}
    >
        {#each context.files as file (file)}
            <li in:panelIn out:panelOut class="min-w-0 sm:w-72 sm:flex-none">
                <Item {file} onRemove={context.remove} removable={!context.disabled} />
            </li>
        {/each}
    </ul>
{/if}

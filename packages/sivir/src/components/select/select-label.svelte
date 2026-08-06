<script lang="ts">
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import type { Snippet } from 'svelte';

    type Props = {
        children: Snippet;
        class?: string;
    };

    let { children, class: className, ...rest }: Props = $props();
</script>

<DropdownMenu.Label {...rest} class={className}> {@render children?.()} </DropdownMenu.Label>

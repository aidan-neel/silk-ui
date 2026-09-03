<script lang="ts">
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import { cn } from '@sivir-ui/svelte/utils';
    import { getContext } from 'svelte';
    import type { CodeBlockListProps, CodeBlockRegistry } from '.';

    let { children, class: className, ...rest }: CodeBlockListProps = $props();

    const registry = getContext<CodeBlockRegistry>('code-block');
    if (registry) {
        registry.tabbed = true;
    }
</script>

<!-- Delegates the active-underline indicator + keyboard nav to Sivir's Tabs. -->
<Tabs.List class={cn(className, 'border-0 bg-transparent p-0')} {...rest}>
    {@render children?.()}
</Tabs.List>

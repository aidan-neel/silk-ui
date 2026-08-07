<!-- token-lint-disable-file -->
<script lang="ts">
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { CodeBlockTriggerProps } from '.';

    let {
        children,
        class: className,
        value,
        disabled = false,
        ...rest
    }: CodeBlockTriggerProps = $props();
</script>

<Tabs.Trigger
    {value}
    {disabled}
    data-ui="code-block-trigger"
    class={cn(className, 'text-[13px] min-h-[28px] py-0')}
    {...rest}
>
    {@render children?.()}
</Tabs.Trigger>

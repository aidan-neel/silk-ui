<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { CodeBlockHeaderProps } from '.';

    let { children, class: className, ...rest }: CodeBlockHeaderProps = $props();
</script>

<!-- The tab List flows from the left; Actions carries `ml-auto` to pin right. -->
<div
    data-ui="code-block-header"
    class={cn(className, 'flex w-full flex-row items-center px-1 py-1.5')}
    {...rest}
>
    {@render children?.()}
</div>

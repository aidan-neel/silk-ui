<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ModalHeaderProps } from '.';

    let { class: className, children, ...rest }: ModalHeaderProps = $props();
</script>

<div {...rest} class={cn(className, 'flex flex-col gap-1.5')}>
    {@render children?.()}
</div>

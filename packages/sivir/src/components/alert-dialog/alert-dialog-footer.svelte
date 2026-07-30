<script lang="ts">
	import * as Modal from '@sivir/ui/components/modal';
	import { cn, type DefaultProps } from '@sivir/ui/utils';

	let { class: className, children, ...rest }: DefaultProps = $props();
</script>

<Modal.Footer class={cn(className, 'mt-1')} {...rest}>
	{@render children?.()}
</Modal.Footer>

<script lang="ts">
	import { Button } from '@sivir-ui/svelte/components/button';
	import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
	import { Textarea } from '@sivir-ui/svelte/components/textarea';
	import { Toolbar } from '@sivir-ui/svelte/components/toolbar';
	import AtSign from '@lucide/svelte/icons/at-sign';
	import ImagePlus from '@lucide/svelte/icons/image-plus';
	import SmilePlus from '@lucide/svelte/icons/smile-plus';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
</script>

<div class="w-full max-w-xl">
	<Textarea aria-label="Reply to issue" placeholder="Reply to Aidan's comment..." autoresize>
		<Toolbar aria-label="Reply actions">
			<div class="flex items-center gap-1">
				<Button
					variant="ghost"
					size="sm"
					class="size-7 rounded-[var(--radius-md)] p-0"
					aria-label="Mention someone"><AtSign size={14} /></Button
				>
				<Button
					variant="ghost"
					size="sm"
					class="size-7 rounded-[var(--radius-md)] p-0"
					aria-label="Add image"><ImagePlus size={14} /></Button
				>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						variant="ghost"
						size="sm"
						class="size-7 rounded-[var(--radius-md)] p-0"
						aria-label="Add reaction"
					>
						<SmilePlus size={14} />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="min-w-40">
						<DropdownMenu.Label>Quick reactions</DropdownMenu.Label>
						<DropdownMenu.Item>Thumbs up</DropdownMenu.Item>
						<DropdownMenu.Item>Eyes</DropdownMenu.Item>
						<DropdownMenu.Item>Celebrate</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<Button type="button" size="sm" class="size-7 rounded-full p-0" aria-label="Reply"
				><ArrowUp size={14} /></Button
			>
		</Toolbar>
	</Textarea>
</div>

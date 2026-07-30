<script lang="ts">
	import * as ContextMenu from '@sivir/ui/components/context-menu';
	import Shortcut from '@sivir/ui/components/shortcut';
	import Copy from '@lucide/svelte/icons/copy';
	import Clipboard from '@lucide/svelte/icons/clipboard-paste';
	import Scissors from '@lucide/svelte/icons/scissors';
	import Clone from '@lucide/svelte/icons/files';
	import Pencil from '@lucide/svelte/icons/pencil';
	import ArrowUp from '@lucide/svelte/icons/arrow-up-to-line';
	import ArrowDown from '@lucide/svelte/icons/arrow-down-to-line';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Lock from '@lucide/svelte/icons/lock';
	import Trash from '@lucide/svelte/icons/trash-2';

	let locked = $state(false);
	let visible = $state(true);
</script>

<div class="flex items-center justify-center">
	<ContextMenu.Root>
		<ContextMenu.Trigger>
			<div
				class="flex h-28 w-64 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-secondary/30 text-sm text-foreground-muted"
			>
				Right-click here
			</div>
		</ContextMenu.Trigger>

		<ContextMenu.Content class="min-w-[16rem]">
			<ContextMenu.Item callback={() => {}}>
				<span class="flex items-center gap-2"><Scissors size={14} /> Cut</span>
				<Shortcut shortcut="cmd+X" />
			</ContextMenu.Item>
			<ContextMenu.Item callback={() => {}}>
				<span class="flex items-center gap-2"><Copy size={14} /> Copy</span>
				<Shortcut shortcut="cmd+C" />
			</ContextMenu.Item>
			<ContextMenu.Item callback={() => {}}>
				<span class="flex items-center gap-2"><Clipboard size={14} /> Paste</span>
				<Shortcut shortcut="cmd+V" />
			</ContextMenu.Item>
			<ContextMenu.Item callback={() => {}}>
				<span class="flex items-center gap-2"><Clone size={14} /> Duplicate</span>
				<Shortcut shortcut="cmd+D" />
			</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Sub>
				<ContextMenu.SubTrigger>
					<span class="flex items-center gap-2">Arrange</span>
				</ContextMenu.SubTrigger>
				<ContextMenu.SubContent class="min-w-[12rem]">
					<ContextMenu.Item callback={() => {}}>
						<span class="flex items-center gap-2"><ArrowUp size={14} /> Bring to front</span>
						<Shortcut shortcut="cmd+]" />
					</ContextMenu.Item>
					<ContextMenu.Item callback={() => {}}>
						<span class="flex items-center gap-2"><ArrowDown size={14} /> Send to back</span>
						<Shortcut shortcut="cmd+[" />
					</ContextMenu.Item>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>

			<ContextMenu.Item callback={() => {}}>
				<span class="flex items-center gap-2"><Pencil size={14} /> Rename</span>
				<Shortcut shortcut="enter" />
			</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.CheckboxItem value="visible" bind:checked={visible} inset callback={() => {}}>
				<span class="flex items-center gap-2">
					{#if visible}
						<Eye size={14} />
					{:else}
						<EyeOff size={14} />
					{/if}
					Show layer
				</span>
			</ContextMenu.CheckboxItem>
			<ContextMenu.CheckboxItem value="locked" bind:checked={locked} inset callback={() => {}}>
				<span class="flex items-center gap-2"><Lock size={14} /> Lock layer</span>
			</ContextMenu.CheckboxItem>

			<ContextMenu.Separator />

			<ContextMenu.Item callback={() => {}}>
				<span class="flex items-center gap-2 text-[var(--color-error)]">
					<Trash size={14} /> Delete
				</span>
				<Shortcut shortcut="backspace" />
			</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Root>
</div>

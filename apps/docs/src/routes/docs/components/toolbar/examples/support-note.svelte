<script lang="ts">
	import { Button } from '@sivir-ui/svelte/components/button';
	import { Textarea } from '@sivir-ui/svelte/components/textarea';
	import { Toolbar } from '@sivir-ui/svelte/components/toolbar';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Paperclip from '@lucide/svelte/icons/paperclip';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
</script>

<div class="w-full max-w-xl">
	<div class="border-b border-border px-3 py-2 text-sm text-foreground-muted">
		Replying to Nora about her billing question
	</div>
	<Textarea aria-label="Support reply" placeholder="Write a helpful response..." autoresize>
		<Toolbar aria-label="Support reply actions">
			<div class="flex items-center gap-1">
				<Button
					variant="ghost"
					size="sm"
					class="size-7 rounded-[var(--radius-md)] p-0"
					aria-label="Attach a file"><Paperclip size={14} /></Button
				>
				<Button
					variant="ghost"
					size="sm"
					class="size-7 rounded-[var(--radius-md)] p-0"
					aria-label="Insert an article"><BookOpen size={14} /></Button
				>
			</div>
			<Button type="button" size="sm" class="size-7 rounded-full p-0" aria-label="Send reply"
				><ArrowUp size={14} /></Button
			>
		</Toolbar>
	</Textarea>
</div>

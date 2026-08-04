<script lang="ts">
import ArrowUp from '@lucide/svelte/icons/arrow-up';
import Code2 from '@lucide/svelte/icons/code-2';
import Sparkles from '@lucide/svelte/icons/sparkles';
import { Button } from '@sivir-ui/svelte/components/button';
import { Textarea } from '@sivir-ui/svelte/components/textarea';
import { Toolbar } from '@sivir-ui/svelte/components/toolbar';

let message = $state('');

function sendMessage(event: SubmitEvent) {
    event.preventDefault();
    message = '';
}
</script>

<form class="w-full max-w-xl" onsubmit={sendMessage}>
    <Textarea
        bind:value={message}
        aria-label="Message the team"
        placeholder="Message the team..."
        autoresize
    >
        <Toolbar aria-label="Message actions">
            <div class="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    class="size-7 rounded-[var(--radius-md)] p-0"
                    aria-label="Add code"><Code2 size={14} /></Button
                >
                <Button
                    variant="ghost"
                    size="sm"
                    class="size-7 rounded-[var(--radius-md)] p-0"
                    aria-label="Improve with AI"><Sparkles size={14} /></Button
                >
            </div>
            <Button
                type="submit"
                variant="primary"
                size="sm"
                class="size-7 rounded-full p-0"
                aria-label="Send message"
                disabled={!message.trim()}><ArrowUp size={14} /></Button
            >
        </Toolbar>
    </Textarea>
</form>

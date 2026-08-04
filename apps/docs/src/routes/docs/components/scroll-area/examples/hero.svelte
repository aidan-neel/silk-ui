<script lang="ts">
import SquarePen from '@lucide/svelte/icons/square-pen';
import { ScrollArea } from '@sivir-ui/svelte/components/scroll-area';

let activeChatId = $state(0);

const chats = [
    { id: 0, date: 'Today', title: 'Svelte 5 runes migration' },
    { id: 1, date: 'Today', title: 'Designing the studio preset' },
    { id: 2, date: 'Today', title: 'Tailwind v4 token setup' },
    { id: 3, date: 'Today', title: 'Pagination active state' },
    { id: 4, date: 'Yesterday', title: 'Figma plugin ideas' },
    { id: 5, date: 'Yesterday', title: 'Vercel deploy hook' },
    { id: 6, date: 'Yesterday', title: 'Refactor command palette' },
    { id: 7, date: 'Yesterday', title: 'Hover card a11y' },
    { id: 8, date: 'Previous 7 days', title: 'Toast queue logic' },
    { id: 9, date: 'Previous 7 days', title: 'Color picker math' },
    { id: 10, date: 'Previous 7 days', title: 'Button loading states' },
    { id: 11, date: 'Previous 7 days', title: 'Modal scroll behavior' },
    { id: 12, date: 'Previous 7 days', title: 'Badge variant system' },
    { id: 13, date: 'Previous 7 days', title: 'Breadcrumb navigation' },
    { id: 14, date: 'Previous 7 days', title: 'Dropdown menu icons' },
    { id: 15, date: 'Previous 7 days', title: 'Alert dialog focus trap' }
];

const groupedChats = chats.reduce(
    (acc, chat) => {
        const group = acc.find((g) => g.date === chat.date);
        if (group) {
            group.items.push(chat);
        } else {
            acc.push({ date: chat.date, items: [chat] });
        }
        return acc;
    },
    [] as Array<{ date: string; items: typeof chats }>
);
</script>

<div class="flex items-center justify-center p-10">
    <div
        class="flex flex-col rounded-[var(--radius-lg)] border border-border bg-card overflow-hidden"
        style="height: 18rem; width: 18rem;"
    >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
            <h2 class="text-sm font-semibold text-foreground">Chats</h2>
            <button
                type="button"
                class="p-1.5 rounded-md hover:bg-secondary text-foreground-muted hover:text-foreground transition-colors"
                title="New chat"
            >
                <SquarePen size={16} />
            </button>
        </div>

        <!-- Scrollable chat list -->
        <ScrollArea class="flex-1" cueRadius="bottom">
            <div class="flex flex-col">
                {#each groupedChats as group (group.date)}
                    <!-- Date header -->
                    <div
                        class="px-4 py-2 pt-3 text-[0.7rem] font-semibold uppercase text-foreground-muted tracking-wider"
                    >
                        {group.date}
                    </div>

                    <!-- Chat items -->
                    {#each group.items as chat (chat.id)}
                        <button
                            type="button"
                            onclick={() => (activeChatId = chat.id)}
                            class="w-full truncate px-3 py-2 text-left text-[0.85rem] transition-colors {activeChatId ===
                            chat.id
                                ? 'bg-secondary text-foreground'
                                : 'text-foreground-muted hover:bg-secondary/50 hover:text-foreground'}"
                        >
                            {chat.title}
                        </button>
                    {/each}
                {/each}
            </div>
        </ScrollArea>
    </div>
</div>

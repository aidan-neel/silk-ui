<script lang="ts">
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
    <ScrollArea
        aria-label="Recent chats"
        class="h-72 w-72 rounded-[var(--radius-lg)] border border-border bg-card"
    >
        <div class="flex flex-col p-2">
            {#each groupedChats as group (group.date)}
                <div
                    class="px-2 py-2 pt-3 text-[0.7rem] font-semibold uppercase tracking-wider text-foreground-muted"
                >
                    {group.date}
                </div>

                {#each group.items as chat (chat.id)}
                    <button
                        type="button"
                        onclick={() => (activeChatId = chat.id)}
                        class="w-full truncate rounded-[var(--radius-md)] px-3 py-2 text-left text-[0.85rem] transition-colors {activeChatId ===
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

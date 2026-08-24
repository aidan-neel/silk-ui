<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { ConversationRootProps } from '.';
    import { type ConversationContext, setConversationContext } from './context.svelte';

    let {
        follow = $bindable(true),
        threshold = 80,
        children,
        class: className,
        ...rest
    }: ConversationRootProps = $props();

    let atBottom = $state(true);
    let scrollingToBottom = $state(false);
    let viewport = $state<HTMLDivElement>();

    const conversation: ConversationContext = {
        get follow() {
            return follow;
        },
        set follow(value) {
            follow = value;
        },
        get threshold() {
            return threshold;
        },
        get atBottom() {
            return atBottom;
        },
        set atBottom(value) {
            atBottom = value;
        },
        get scrollingToBottom() {
            return scrollingToBottom;
        },
        set scrollingToBottom(value) {
            scrollingToBottom = value;
        },
        get viewport() {
            return viewport;
        },
        set viewport(value) {
            viewport = value;
        },
        scrollToBottom(behavior = 'auto') {
            follow = true;
            scrollingToBottom = behavior === 'smooth';
            if (!viewport) {
                scrollingToBottom = false;
                return;
            }
            viewport.scrollTo({ top: viewport.scrollHeight, behavior });
        }
    };

    setConversationContext(conversation);
</script>

<div
    {...rest}
    data-ui="conversation"
    data-state={follow ? 'following' : 'paused'}
    class={cn(className, 'relative min-h-0 overflow-hidden')}
>
    {@render children?.()}
</div>

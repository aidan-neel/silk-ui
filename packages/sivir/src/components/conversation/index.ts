import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './conversation.svelte';
import Content from './conversation-content.svelte';
import Empty from './conversation-empty.svelte';
import ScrollButton from './conversation-scroll-button.svelte';

export type ConversationRootProps = {
    /** Whether new content should keep the transcript pinned to its latest message. */
    follow?: boolean;
    /** Distance from the bottom, in pixels, that still counts as following. */
    threshold?: number;
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type ConversationContentProps = {
    /** Classes applied to the inner transcript stack rather than the scroll viewport. */
    transcriptClass?: string;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'aria-live' | 'aria-relevant'>;

export type ConversationEmptyProps = {
    icon?: Snippet;
    title?: string;
    description?: string;
    action?: Snippet;
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type ConversationScrollButtonProps = {
    label?: string;
    class?: string;
} & Omit<
    HTMLButtonAttributes,
    'children' | 'class' | 'aria-label' | 'disabled' | 'tabindex' | 'type'
>;

export { Root, Content, Empty, ScrollButton };

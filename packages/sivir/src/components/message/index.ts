import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './message.svelte';
import Content from './message-content.svelte';
import Actions from './message-actions.svelte';

export type MessageFrom = 'assistant' | 'user' | 'system';
export type MessageStatus = 'idle' | 'streaming' | 'error';

export type MessageRootProps = {
    from?: MessageFrom;
    status?: MessageStatus;
    name?: string;
    timestamp?: string;
    avatar?: Snippet;
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLElement>, 'children' | 'aria-busy'>;

export type MessageContentProps = DefaultProps & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export type MessageActionsProps = DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>;

export { Root, Content, Actions };

import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './tool.svelte';
import Item from './tool-item.svelte';
import Input from './tool-input.svelte';
import Output from './tool-output.svelte';
export type ToolState = 'running' | 'complete' | 'error';
export type ToolProps = {
    /** A concise summary of the work completed by this task group. */
    name: string;
    state?: ToolState;
    /** A compact summary of how long the task took, such as 6s. */
    duration?: string;
    /** Whether the individual tool calls are visible. */
    open?: boolean;
    children?: Snippet;
} & DefaultProps & Omit<HTMLAttributes<HTMLElement>, 'children'>;
export type ToolItemProps = {
    name: string;
    detail?: string;
    kind?: 'command' | 'search' | 'read';
} & DefaultProps;
export type ToolInputProps = {
    label?: string;
    children?: Snippet;
} & DefaultProps & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
export type ToolOutputProps = {
    label?: string;
    children?: Snippet;
} & DefaultProps & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
export { Root, Item, Input, Output };

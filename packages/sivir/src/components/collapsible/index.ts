import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './collapsible.svelte';
import Trigger from './collapsible-trigger.svelte';
import Content from './collapsible-content.svelte';

export type CollapsibleProps = {
	open?: boolean;
	disabled?: boolean;
	children?: Snippet;
};

export type CollapsibleTriggerProps = {
	children?: Snippet;
} & DefaultProps &
	Omit<HTMLButtonAttributes, 'onclick' | 'children'>;

export type CollapsibleContentProps = {
	children?: Snippet;
} & DefaultProps;

export type CollapsibleState = {
	open: boolean;
	disabled: boolean;
};

export { Root, Trigger, Content };

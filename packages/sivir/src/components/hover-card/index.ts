import type { Snippet } from 'svelte';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './hover-card.svelte';
import Trigger from './hover-card-trigger.svelte';
import Content from './hover-card-content.svelte';
import Title from './hover-card-title.svelte';
import Description from './hover-card-description.svelte';

export type HoverCardProps = {
	open?: boolean;
	openDelay?: number;
	closeDelay?: number;
	children?: Snippet;
};

export type HoverCardTriggerProps = {
	href?: string;
	children?: Snippet;
} & DefaultProps;

export type HoverCardContentProps = {
	side?: 'top' | 'bottom' | 'left' | 'right';
	align?: 'start' | 'center' | 'end';
	children?: Snippet;
} & DefaultProps;

export { Root, Trigger, Content, Title, Description };

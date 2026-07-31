import type { Snippet } from 'svelte';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './accordion.svelte';
import Item from './accordion-item.svelte';
import Trigger from './accordion-trigger.svelte';
import Content from './accordion-content.svelte';

export type AccordionProps = {
	type?: 'single' | 'multiple';
	value?: string | string[];
	collapsible?: boolean;
	onValueChange?: (value: string | string[] | undefined) => void;
	children?: Snippet;
} & DefaultProps;

export type AccordionItemProps = {
	value: string;
	disabled?: boolean;
	children?: Snippet;
} & DefaultProps;

export type AccordionTriggerProps = {
	children?: Snippet;
} & DefaultProps;

export type AccordionContentProps = {
	children?: Snippet;
} & DefaultProps;

export type AccordionContext = {
	isOpen: (value: string) => boolean;
	toggle: (value: string) => void;
};

export { Root, Item, Trigger, Content };

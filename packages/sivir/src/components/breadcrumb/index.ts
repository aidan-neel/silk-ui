import Root from './breadcrumb.svelte';
import Item from './breadcrumb-item.svelte';
import Separator from './breadcrumb-separator.svelte';
import type { DefaultProps } from '@sivir-ui/svelte/utils';

export type BreadcrumbProps = DefaultProps;
export type BreadcrumbItemProps = {
    href?: string;
} & DefaultProps;
export type BreadcrumbSeparatorProps = DefaultProps;

export { Root, Item, Separator };

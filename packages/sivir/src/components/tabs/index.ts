import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './tabs.svelte';
import Content from './tabs-content.svelte';
import List from './tabs-list.svelte';
import Trigger from './tabs-trigger.svelte';

export type TabsVariant = 'default' | 'ghost' | 'segmented';

export type TabsState = {
    id: string;
    value: string;
    orientation: 'horizontal' | 'vertical';
    variant: TabsVariant;
};

export type TabsProps = {
    value?: string;
    onValueChange?: (value: string) => void;
    orientation?: 'horizontal' | 'vertical';
    variant?: TabsVariant;
} & DefaultProps;

export type TabsListProps = DefaultProps;

export type TabsTriggerProps = {
    value: string;
    disabled?: boolean;
} & DefaultProps;

export type TabsContentProps = {
    value: string;
    forceMount?: boolean;
} & DefaultProps;

export { Content, List, Root, Trigger };

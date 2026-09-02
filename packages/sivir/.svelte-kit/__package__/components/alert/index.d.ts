import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './alert.svelte';
import Description from './alert-description.svelte';
import Title from './alert-title.svelte';
export type AlertVariant = 'info' | 'error' | 'success' | 'warning';
export type AlertProps = {
    variant?: AlertVariant;
} & DefaultProps;
export type AlertTitleProps = DefaultProps;
export type AlertDescriptionProps = DefaultProps;
export { Description, Root, Title };

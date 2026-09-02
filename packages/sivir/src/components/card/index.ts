import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './card.svelte';
import Content from './card-content.svelte';
import Description from './card-description.svelte';
import Footer from './card-footer.svelte';
import Header from './card-header.svelte';
import Title from './card-title.svelte';

export type CardProps = {
    variant?: 'default' | 'panel';
} & DefaultProps;

export type CardHeaderProps = DefaultProps;
export type CardTitleProps = DefaultProps;
export type CardDescriptionProps = DefaultProps;
export type CardContentProps = DefaultProps;
export type CardFooterProps = DefaultProps;

export { Content, Description, Footer, Header, Root, Title };

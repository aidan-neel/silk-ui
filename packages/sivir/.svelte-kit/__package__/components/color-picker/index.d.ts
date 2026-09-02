import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import Content from './color-picker-content.svelte';
import Root from './color-picker-root.svelte';
import Trigger from './color-picker-trigger.svelte';
import type { ColorFormat, ColorOption } from './context';
export type { ColorFormat, ColorOption, ColorPickerContext } from './context';
export type ColorPickerProps = {
    label?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    options?: ColorOption[];
    format?: ColorFormat;
    children?: Snippet;
} & DefaultProps;
export { Content, Root, Trigger };

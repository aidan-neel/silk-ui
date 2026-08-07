import type { Snippet } from 'svelte';
import { type ColorFormat, type ColorOption } from './context';
type Props = {
    label?: string;
    value: string;
    onValueChange?: (value: string) => void;
    options?: ColorOption[];
    /** Channel controls shown in the picker. Defaults to HSL. */
    format?: ColorFormat;
    class?: string;
    children: Snippet;
};
declare const ColorPickerRoot: import('svelte').Component<Props, {}, ''>;
type ColorPickerRoot = ReturnType<typeof ColorPickerRoot>;
export default ColorPickerRoot;

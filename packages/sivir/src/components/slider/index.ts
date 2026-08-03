import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Slider from './slider.svelte';

export type SliderProps = {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    label?: string;
    onValueChange?: (value: number) => void;
} & DefaultProps;

export { Slider };
export default Slider;

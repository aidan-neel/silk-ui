import { getContext, setContext } from 'svelte';

export type ColorOption = {
    label: string;
    value: string;
};

export type ColorFormat = 'hsl' | 'rgb' | 'hsv';

const CONTEXT_KEY = Symbol('sivir-color-picker');

/** Shared between ColorPicker.Root, .Trigger, and .Content. Root owns the
 * value/options and exposes `apply` so Trigger/Content can commit a new hex. */
export type ColorPickerContext = {
    readonly value: string;
    readonly options: ColorOption[];
    readonly format: ColorFormat;
    apply: (hex: string) => void;
};

export function setColorPickerContext(ctx: ColorPickerContext): ColorPickerContext {
    return setContext(CONTEXT_KEY, ctx);
}

export function getColorPickerContext(): ColorPickerContext {
    const ctx = getContext<ColorPickerContext | undefined>(CONTEXT_KEY);
    if (!ctx) {
        throw new Error(
            'ColorPicker.Trigger and ColorPicker.Content must be used inside ColorPicker.Root'
        );
    }
    return ctx;
}

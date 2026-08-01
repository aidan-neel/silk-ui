export type ColorOption = {
    label: string;
    value: string;
};
export type ColorFormat = 'hsl' | 'rgb' | 'hsv';
/** Shared between ColorPicker.Root, .Trigger, and .Content. Root owns the
 * value/options and exposes `apply` so Trigger/Content can commit a new hex. */
export type ColorPickerContext = {
    readonly value: string;
    readonly options: ColorOption[];
    readonly format: ColorFormat;
    apply: (hex: string) => void;
};
export declare function setColorPickerContext(ctx: ColorPickerContext): ColorPickerContext;
export declare function getColorPickerContext(): ColorPickerContext;

import { getContext, setContext } from 'svelte';
const CONTEXT_KEY = Symbol('sivir-color-picker');
export function setColorPickerContext(ctx) {
    return setContext(CONTEXT_KEY, ctx);
}
export function getColorPickerContext() {
    const ctx = getContext(CONTEXT_KEY);
    if (!ctx) {
        throw new Error(
            'ColorPicker.Trigger and ColorPicker.Content must be used inside ColorPicker.Root'
        );
    }
    return ctx;
}

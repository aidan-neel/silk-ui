type Props = {
    /** Trigger style -- matches Button variants. Defaults to outlined. */
    variant?: 'outline' | 'secondary' | 'ghost';
    class?: string;
};
declare const ColorPickerTrigger: import('svelte').Component<Props, {}, ''>;
type ColorPickerTrigger = ReturnType<typeof ColorPickerTrigger>;
export default ColorPickerTrigger;

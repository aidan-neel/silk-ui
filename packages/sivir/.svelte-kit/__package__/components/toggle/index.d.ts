import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Toggle from './toggle.svelte';
export type ToggleProps = {
    pressed?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'outlined';
    children?: Snippet;
    onPressedChange?: (pressed: boolean) => void;
} & DefaultProps &
    Omit<HTMLButtonAttributes, 'onclick' | 'children'>;
export { Toggle };
export default Toggle;

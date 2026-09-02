import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { HTMLLabelAttributes } from 'svelte/elements';
import Checkbox from './checkbox.svelte';
export type CheckboxProps = {
    checked?: boolean;
    label?: string;
    description?: string;
    disabled?: boolean;
    variant?: 'default' | 'primary';
    onCheckedChange?: (checked: boolean) => void;
} & DefaultProps & Omit<HTMLLabelAttributes, 'children'>;
export { Checkbox };
export default Checkbox;

import type { HTMLButtonAttributes } from 'svelte/elements';
import Switch from './switch.svelte';

export type SwitchState = {
    switched: boolean;
};

export type SwitchProps = {
    checked?: boolean;
    switched?: boolean;
    label?: string;
    description?: string;
    element?: HTMLButtonElement | undefined;
} & Partial<HTMLButtonAttributes>;

export default Switch;
export { Switch };

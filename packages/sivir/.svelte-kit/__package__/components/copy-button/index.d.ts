import type { ButtonVariant } from '@sivir-ui/svelte/components/button';
import type { HTMLButtonAttributes } from 'svelte/elements';
import CopyButton from './copy-button.svelte';
export type CopyButtonProps = {
    /** The string written to the clipboard on click. */
    text: string;
    /** Tooltip label at rest. */
    label?: string;
    /** Tooltip label shown right after copying. */
    copiedLabel?: string;
    /** How long (ms) to hold the copied state before reverting. */
    duration?: number;
    /** Button variant (defaults to `ghost`). */
    variant?: ButtonVariant;
    /** Button size (defaults to `icon`). */
    size?: 'sm' | 'md' | 'lg' | 'icon';
    class?: string;
    /** Fired after the text is successfully written to the clipboard. */
    oncopy?: (text: string) => void;
} & Omit<HTMLButtonAttributes, 'class' | 'type'>;
export { CopyButton };
export default CopyButton;

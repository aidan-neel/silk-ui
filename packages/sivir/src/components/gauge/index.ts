import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Gauge from './gauge.svelte';

export type GaugeTone = 'primary' | 'muted' | 'success' | 'warning' | 'error';

export type GaugeProps = {
    /** The bounded quantity shown by the filled arc. */
    value: number;
    max?: number;
    /** Describes the quantity, such as "Context remaining" or "Monthly API usage". */
    label?: string;
    size?: number;
    strokeWidth?: number;
    tone?: GaugeTone;
} & DefaultProps;

export { Gauge };
export default Gauge;

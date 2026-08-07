import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import ShowMore from './show-more.svelte';
export type ShowMoreProps = {
    /** Number of visible text lines while collapsed. */
    lines?: number;
    /** Maximum expanded height before the content becomes scrollable. */
    maxHeight?: number;
    /** Initial expanded state when `expanded` is not bound. */
    defaultExpanded?: boolean;
    /** Bindable disclosure state. */
    expanded?: boolean;
    moreLabel?: string;
    lessLabel?: string;
    /** Accessible name for the expanded scroll region when the content is capped. */
    label?: string;
    onExpandedChange?: (expanded: boolean) => void;
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;
export { ShowMore };
export default ShowMore;

import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import ResponseStream from './response-stream.svelte';

export type ResponseStreamProps = {
    /** A complete response or an async source of response chunks. */
    textStream: string | AsyncIterable<string>;
    /** Treat string values as cumulative snapshots of one live response. */
    streaming?: boolean;
    /** 1 is slowest and 100 is fastest: reveal pace for static strings, roll duration for arrivals. Live chunks render on arrival. */
    speed?: number;
    characterChunkSize?: number;
    onComplete?: () => void;
    onError?: (error: unknown) => void;
    as?: keyof SvelteHTMLElements;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export { ResponseStream };

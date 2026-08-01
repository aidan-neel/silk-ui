import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import ResponseStream from './response-stream.svelte';
export type Mode = 'typewriter' | 'fade';
export type Segment = {
    text: string;
    index: number;
};
export type ResponseStreamProps = {
    /** A complete response or an async source of response chunks. */
    textStream: string | AsyncIterable<string>;
    mode?: Mode;
    /** 1 is slowest and 100 is fastest for static strings. Live chunks render on arrival. */
    speed?: number;
    fadeDuration?: number;
    segmentDelay?: number;
    characterChunkSize?: number;
    onComplete?: () => void;
    onError?: (error: unknown) => void;
    as?: keyof SvelteHTMLElements;
} & DefaultProps & Omit<HTMLAttributes<HTMLElement>, 'children'>;
export { ResponseStream };

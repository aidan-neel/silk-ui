import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import ResponseStream from './response-stream.svelte';
export type Mode = 'typewriter' | 'fade';
export type Segment = {
    text: string;
    index: number;
    key: string;
};
export type ResponseStreamProps = {
    /** A complete response or an async source of response chunks. */
    textStream: string | AsyncIterable<string>;
    /** Treat string values as cumulative snapshots of one live response. */
    streaming?: boolean;
    mode?: Mode;
    /** 1 is slowest and 100 is fastest for static strings. Live chunks render on arrival. */
    speed?: number;
    /** Duration in milliseconds for each word's blur-and-opacity entrance. */
    fadeDuration?: number;
    /** Optional stagger in milliseconds between fade-mode words. */
    segmentDelay?: number;
    characterChunkSize?: number;
    onComplete?: () => void;
    onError?: (error: unknown) => void;
    as?: keyof SvelteHTMLElements;
} & DefaultProps & Omit<HTMLAttributes<HTMLElement>, 'children'>;
export { ResponseStream };

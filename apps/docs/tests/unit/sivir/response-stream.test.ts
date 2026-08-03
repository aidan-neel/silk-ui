import { describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import ResponseStream from '@sivir-ui/svelte/components/response-stream/response-stream.svelte';

async function* chunks() {
    yield 'First ';
    yield 'chunk';
}

describe('ResponseStream', () => {
    it('does not stagger fade segments unless configured', async () => {
        const { container } = render(ResponseStream, {
            props: {
                textStream: 'First chunk',
                mode: 'fade',
                characterChunkSize: 20
            }
        });

        await waitFor(() => expect(container).toHaveTextContent('First chunk'));
        const segments = container.querySelectorAll<HTMLSpanElement>(
            '.sivir-response-stream-segment'
        );

        expect(segments[0]?.style.getPropertyValue('--response-stream-segment-delay')).toBe('0ms');
        expect(segments[1]?.style.getPropertyValue('--response-stream-segment-delay')).toBe('0ms');
    });

    it('applies the configured fade segment delay', async () => {
        const { container } = render(ResponseStream, {
            props: {
                textStream: 'First chunk',
                mode: 'fade',
                segmentDelay: 20,
                characterChunkSize: 20
            }
        });

        await waitFor(() => expect(container).toHaveTextContent('First chunk'));
        const segments = container.querySelectorAll<HTMLSpanElement>(
            '.sivir-response-stream-segment'
        );

        expect(segments[1]?.style.getPropertyValue('--response-stream-segment-delay')).toBe('20ms');
    });

    it('renders live chunks with an optional minimal fade delay', async () => {
        const { container } = render(ResponseStream, {
            props: { textStream: chunks(), mode: 'fade', speed: 1, segmentDelay: 20 }
        });

        await waitFor(() => expect(container).toHaveTextContent('First chunk'));
        const segment = container.querySelector<HTMLSpanElement>('.sivir-response-stream-segment');
        expect(segment?.style.getPropertyValue('--response-stream-segment-delay')).toBe('20ms');
    });
});

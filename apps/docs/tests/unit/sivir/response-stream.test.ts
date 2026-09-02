import ResponseStream from '@sivir-ui/svelte/components/response-stream/response-stream.svelte';
import { render, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

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

    it('shows a waiting caret until the first live chunk arrives', async () => {
        let release!: () => void;
        const gate = new Promise<void>((resolve) => {
            release = resolve;
        });

        async function* delayed() {
            await gate;
            yield 'Hello';
        }

        const { container } = render(ResponseStream, {
            props: { textStream: delayed() }
        });

        await waitFor(() => {
            expect(container.querySelector('[data-ui="response-stream"]')).toHaveAttribute(
                'data-state',
                'waiting'
            );
        });
        expect(container.querySelector('[data-ui="response-stream-caret"]')).not.toBeNull();

        release();

        await waitFor(() => expect(container).toHaveTextContent('Hello'));
        expect(container.querySelector('[data-ui="response-stream-caret"]')).toBeNull();
        expect(container.querySelector('[data-ui="response-stream"]')).not.toHaveAttribute(
            'data-state',
            'waiting'
        );
    });
});

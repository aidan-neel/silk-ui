import ResponseStream from '@sivir-ui/svelte/components/response-stream/response-stream.svelte';
import { render, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

async function* chunks() {
    yield 'First ';
    yield 'chunk';
}

describe('ResponseStream', () => {
    it('renders a complete string in full', async () => {
        const { container } = render(ResponseStream, {
            props: {
                textStream: 'First chunk',
                characterChunkSize: 20
            }
        });

        await waitFor(() => expect(container).toHaveTextContent('First chunk'));
    });

    it('renders live chunks as they arrive', async () => {
        const { container } = render(ResponseStream, {
            props: { textStream: chunks(), speed: 1 }
        });

        await waitFor(() => expect(container).toHaveTextContent('First chunk'));
    });

    it('renders medium body text', async () => {
        const { container } = render(ResponseStream, {
            props: {
                textStream: 'First chunk',
                characterChunkSize: 20
            }
        });

        await waitFor(() => expect(container).toHaveTextContent('First chunk'));
        expect(container.querySelector('[data-ui="response-stream"]')?.className).toContain(
            'font-medium'
        );
    });

    it('renders streamed text as plain text without animation support', async () => {
        const { container } = render(ResponseStream, {
            props: {
                textStream: 'First chunk',
                characterChunkSize: 20
            }
        });

        await waitFor(() => expect(container).toHaveTextContent('First chunk'));
        expect(container.querySelector('scritto-text')).not.toBeInTheDocument();
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

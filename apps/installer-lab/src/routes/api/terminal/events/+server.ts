import type { RequestHandler } from './$types';
import { assertLocalRequest } from '$lib/server/local-only';
import { terminalManager } from '$lib/server/terminal-manager';

const encoder = new TextEncoder();

export const GET: RequestHandler = async (event) => {
    assertLocalRequest(event);
    await terminalManager.initialize();
    let unsubscribe = () => {};
    let heartbeat: ReturnType<typeof setInterval>;
    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            const send = (name: string, value: unknown) => {
                controller.enqueue(
                    encoder.encode(`event: ${name}\ndata: ${JSON.stringify(value)}\n\n`)
                );
            };
            unsubscribe = terminalManager.subscribe((terminalEvent) => {
                if (terminalEvent.type === 'log') send('log', { chunk: terminalEvent.chunk });
                else if (terminalEvent.type === 'clear') send('clear', {});
                else send('snapshot', terminalEvent.snapshot);
            });
            heartbeat = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(': heartbeat\n\n'));
                } catch {
                    clearInterval(heartbeat);
                }
            }, 15_000);
            event.request.signal.addEventListener(
                'abort',
                () => {
                    clearInterval(heartbeat);
                    unsubscribe();
                    try {
                        controller.close();
                    } catch {
                        // The client already closed the stream.
                    }
                },
                { once: true }
            );
        },
        cancel() {
            clearInterval(heartbeat);
            unsubscribe();
        }
    });

    return new Response(stream, {
        headers: {
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache, no-transform',
            connection: 'keep-alive',
            'x-accel-buffering': 'no'
        }
    });
};

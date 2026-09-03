<script lang="ts">
    import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';

    const text =
        'This text rolls in word by word. Use response streaming to make an AI answer feel immediate while preserving the layout of the surrounding message. Each arrival eases in through the roller, the block grows smoothly as new lines wrap into view, and speed sets how quickly every word settles.';

    function wait(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async function* delayedResponse() {
        await wait(1200);

        const parts = text.split(/(\s+)/);
        for (const part of parts) {
            yield part;
            await wait(40);
        }
    }
</script>

<div class="w-full max-w-xl">
    <ResponseStream textStream={delayedResponse()} speed={10} />
</div>

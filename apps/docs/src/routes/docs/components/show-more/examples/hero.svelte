<script lang="ts">
    import { ShowMore } from '@sivir-ui/svelte/components/show-more';

    const paragraphs = [
        'Sivir components stay quiet until they are needed. ShowMore keeps dense prose readable by revealing a deliberate preview, then lets people open the complete detail without leaving their place in the page.',
        'It measures the rendered content, so the disclosure only appears when there is actually more to read. When the full text fits inside the line budget, no toggle renders at all.',
        'Expanded content can also cap at a maximum height, turning into a keyboard-focusable scroll region for very long bodies like release notes or transcripts.'
    ];
</script>

<div class="w-full max-w-md">
    <ShowMore lines={2} label="Component details">
        <div class="flex flex-col gap-2">
            {#each paragraphs as paragraph (paragraph)}
                <p>{paragraph}</p>
            {/each}
        </div>
    </ShowMore>
</div>

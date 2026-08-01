<script lang="ts">
    import { ShowMore } from '@sivir-ui/svelte/components/show-more';

    const text = `Sivir components are designed to stay quiet until they are needed. ShowMore keeps dense prose readable by revealing a deliberate preview, then lets people open the complete detail without leaving their place in the page. It measures the rendered content, so the disclosure only appears when there is actually more to read.`;
</script>

<ShowMore lines={2} label="Component details">
    <p>{text}</p>
</ShowMore>

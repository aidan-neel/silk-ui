<script lang="ts">
import { ShowMore } from '@sivir-ui/svelte/components/show-more';

const entries = Array.from(
    { length: 10 },
    (_, index) =>
        `Release note ${index + 1}: the component retains its layout while content changes.`
);
</script>

<ShowMore lines={2} maxHeight={112} label="Release notes">
    <div class="flex flex-col gap-2">
        {#each entries as entry (entry)}
            <p>{entry}</p>
        {/each}
    </div>
</ShowMore>

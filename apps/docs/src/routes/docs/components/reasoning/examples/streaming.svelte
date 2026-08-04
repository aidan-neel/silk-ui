<script lang="ts">
import * as Reasoning from '@sivir-ui/svelte/components/reasoning';
import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';

const trace =
    'I need the release history, current error sample, and payment-provider status before I can recommend a rollback.';
</script>

<Reasoning.Root class="w-full max-w-xl" streaming open>
    <Reasoning.Trigger />
    <Reasoning.Content>
        <ResponseStream textStream={trace} speed={100} class="text-foreground-muted" />
    </Reasoning.Content>
</Reasoning.Root>

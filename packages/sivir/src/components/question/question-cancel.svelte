<script lang="ts">
import { Button } from '@sivir-ui/svelte/components/button';
import type { QuestionActionProps } from '.';
import { getQuestionContext } from './context.svelte';

let { children, disabled = false, onclick, ...rest }: QuestionActionProps = $props();
const context = getQuestionContext();
</script>

<Button
    {...rest}
    type="button"
    variant="quiet"
    size="md"
    data-ui="question-cancel"
    disabled={context.disabled || context.busy || disabled}
    onclick={(event: MouseEvent) => {
        onclick?.(event);
        if (!event.defaultPrevented) {
            context.cancel(event);
        }
    }}
>
    {@render children?.()}
</Button>

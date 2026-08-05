<script lang="ts">
import { cn } from '@sivir-ui/svelte/utils';
import type { QuestionActionsProps } from '.';
import { getQuestionContext } from './context.svelte';

let { class: className, children, ...rest }: QuestionActionsProps = $props();
const context = getQuestionContext();
</script>

<div
    {...rest}
    data-ui="question-actions"
    data-state={context.status}
    class={cn(className, 'px-2.5 pt-1 pb-2.5')}
>
    <div class="flex flex-wrap items-center justify-end gap-2">
        {@render children?.()}
    </div>
</div>

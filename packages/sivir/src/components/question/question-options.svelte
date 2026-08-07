<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { QuestionOptionsProps } from '.';
    import { getQuestionContext } from './context.svelte';

    let { class: className, children, ...rest }: QuestionOptionsProps = $props();
    const context = getQuestionContext();
</script>

<div
    {...rest}
    data-ui="question-options"
    data-type={context.type}
    class={cn(className, 'grid gap-2 px-3.5 pt-3 pb-2')}
>
    {@render children?.()}
</div>

<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { QuestionDescriptionProps } from '.';

    let { class: className, children, ...rest }: QuestionDescriptionProps = $props();
</script>

<p
    {...rest}
    data-ui="question-description"
    class={cn(
        className,
        'm-0 px-3.5 pt-0.5 [font-size:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] leading-relaxed text-foreground-muted'
    )}
>
    {@render children?.()}
</p>

<script lang="ts">
    import CircleHelp from '@lucide/svelte/icons/circle-help';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { QuestionTitleProps } from '.';

    let { class: className, children, ...rest }: QuestionTitleProps = $props();
</script>

<legend
    {...rest}
    data-ui="question-title"
    class={cn(
        className,
        'float-none flex w-full items-center gap-2 px-3.5 pt-3.5 [font-family:var(--font-header)] [font-size:var(--font-size-header)] [font-weight:var(--font-weight-header)] [letter-spacing:var(--tracking-header)] leading-snug text-foreground'
    )}
>
    <span class="min-w-0 flex-1">{@render children?.()}</span>
    <span
        class="grid size-7 shrink-0 place-items-center rounded-[var(--radius-md)] bg-secondary text-foreground"
        aria-hidden="true"
    >
        <CircleHelp size={15} strokeWidth={2} />
    </span>
</legend>

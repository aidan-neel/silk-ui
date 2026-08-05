<script lang="ts">
import { cn } from '@sivir-ui/svelte/utils';
import type { PromptComposerInputProps } from '.';
import { getPromptComposerContext } from './context.svelte';

let {
    submitOnEnter = true,
    placeholder = 'Message the agent...',
    'aria-label': ariaLabel = 'Message',
    rows = 1,
    disabled = false,
    readonly = false,
    class: className,
    element = $bindable(),
    oninput,
    onkeydown,
    oncompositionstart,
    oncompositionend,
    ...rest
}: PromptComposerInputProps = $props();

const context = getPromptComposerContext();
let composing = false;

function resize(target = element) {
    if (!target) {
        return;
    }
    target.style.height = 'auto';
    const maxHeight = Number.parseFloat(getComputedStyle(target).maxHeight);
    const height = Number.isFinite(maxHeight)
        ? Math.min(target.scrollHeight, maxHeight)
        : target.scrollHeight;
    target.style.height = `${height}px`;
    target.style.overflowY = target.scrollHeight > height ? 'auto' : 'hidden';
}

function observeSize(target: HTMLTextAreaElement) {
    let width = target.clientWidth;
    const observer = new ResizeObserver(() => {
        const nextWidth = target.clientWidth;
        if (nextWidth === width) {
            return;
        }
        width = nextWidth;
        resize(target);
    });
    observer.observe(target);
    return () => observer.disconnect();
}

$effect(() => {
    context.value;
    resize();
});
</script>

<textarea
    bind:this={element}
    {@attach observeSize}
    {...rest}
    data-ui="prompt-composer-input"
    data-state={context.status}
    value={context.value}
    {placeholder}
    aria-label={ariaLabel}
    aria-busy={context.status === 'submitting'}
    {rows}
    disabled={context.disabled || disabled}
    readonly={context.status === 'submitting' || readonly}
    oninput={(event) => {
        context.value = event.currentTarget.value;
        resize();
        oninput?.(event);
    }}
    onkeydown={(event) => {
        onkeydown?.(event);
        if (
            event.defaultPrevented ||
            !submitOnEnter ||
            event.key !== 'Enter' ||
            event.shiftKey ||
            composing ||
            event.isComposing ||
            event.keyCode === 229
        ) {
            return;
        }
        event.preventDefault();
        context.submit();
    }}
    oncompositionstart={(event) => {
        composing = true;
        oncompositionstart?.(event);
    }}
    oncompositionend={(event) => {
        composing = false;
        oncompositionend?.(event);
    }}
    class={cn(
        className,
        'min-h-12 max-h-52 w-full resize-none overflow-y-hidden bg-transparent px-3.5 pt-3 pb-2 [font-size:var(--font-size-body,16px)] leading-6 text-foreground outline-none placeholder:text-foreground-muted disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-default'
    )}
></textarea>

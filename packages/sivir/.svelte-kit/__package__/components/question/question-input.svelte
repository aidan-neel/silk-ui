<script lang="ts">
import { Textarea } from '@sivir-ui/svelte/components/textarea';
import { cn } from '@sivir-ui/svelte/utils';
import type { HTMLTextareaAttributes } from 'svelte/elements';
import type { QuestionInputProps } from '.';
import { getQuestionContext } from './context.svelte';

let {
    submitOnEnter = true,
    placeholder = 'Type your answer...',
    'aria-label': ariaLabel = 'Answer',
    rows = 2,
    disabled = false,
    readonly = false,
    autoresize = true,
    element = $bindable(),
    class: className,
    oninput,
    onkeydown,
    oncompositionstart,
    oncompositionend,
    ...rest
}: QuestionInputProps = $props();

const context = getQuestionContext();
let composing = false;
</script>

{#if context.type === 'text'}
    <div data-ui="question-input-wrap" class="px-3.5 pt-3 pb-2">
        <Textarea
            bind:element
            {...rest}
            data-question-control
            data-ui="question-input"
            value={Array.isArray(context.answer) ? '' : context.answer}
            name={context.name}
            {placeholder}
            aria-label={ariaLabel}
            aria-busy={context.status === 'submitting'}
            {rows}
            {autoresize}
            disabled={context.disabled || disabled}
            readonly={context.busy || readonly}
            required={context.required}
            aria-invalid={Boolean(context.validationMessage)}
            oninput={(event) => {
                context.setText(event.currentTarget.value);
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
            class={cn(className, 'max-h-40 overflow-y-auto')}
        />
    </div>
{/if}

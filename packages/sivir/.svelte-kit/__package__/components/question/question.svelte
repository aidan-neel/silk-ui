<script lang="ts">
import CircleAlert from '@lucide/svelte/icons/circle-alert';
import { cn } from '@sivir-ui/svelte/utils';
import { untrack } from 'svelte';
import type { QuestionAnswer, QuestionProps, QuestionStatus, QuestionType } from '.';
import { setQuestionContext } from './context.svelte';

let {
    type = 'single',
    value = $bindable(),
    status = 'idle',
    disabled = false,
    required = true,
    autofocus = false,
    name = 'answer',
    errorMessage = 'Answer could not be submitted.',
    onSubmit,
    onCancel,
    class: className,
    children,
    ...rest
}: QuestionProps = $props();

const initialType = untrack(() => type);
value = normalizeAnswer(initialType, value);

let form: HTMLFormElement | undefined;
let pending = $state(false);
let validationAttempt = $state<{ type: QuestionType; revision: number }>();
let focused = false;
let previousType = initialType;
let modeRevision = 0;

const effectiveStatus = $derived<QuestionStatus>(
    status === 'submitting' || pending ? 'submitting' : status
);
const answer = $derived.by<QuestionAnswer>(() => normalizeAnswer(type, value));
const hasAnswer = $derived(Array.isArray(answer) ? answer.length > 0 : answer.trim().length > 0);
const validationMessage = $derived(
    validationAttempt?.type === type &&
        validationAttempt.revision === modeRevision &&
        required &&
        !hasAnswer
        ? getValidationMessage(type)
        : ''
);
const displayStatus = $derived<QuestionStatus>(
    effectiveStatus === 'error' || validationMessage ? 'error' : effectiveStatus
);
const displayErrorMessage = $derived(validationMessage || errorMessage);
const interactiveDisabled = $derived(disabled || effectiveStatus === 'submitting');
const errorNoticeClass =
    'relative z-10 flex w-fit translate-y-2 scale-95 items-center gap-1.5 rounded-t-[var(--radius-md)] rounded-b-none px-2.5 py-1.5 text-xs font-medium text-[var(--color-error)] opacity-0 transition-[opacity,scale,translate] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none data-[state=error]:-translate-y-px data-[state=error]:scale-100 data-[state=error]:opacity-100'; // token-lint-disable-line no-literal-length

const context = setQuestionContext({
    get type() {
        return type;
    },
    get answer() {
        return answer;
    },
    get status() {
        return effectiveStatus;
    },
    get disabled() {
        return disabled;
    },
    get busy() {
        return effectiveStatus === 'submitting';
    },
    get required() {
        return required;
    },
    get canSubmit() {
        return !required || hasAnswer;
    },
    get validationMessage() {
        return validationMessage;
    },
    get name() {
        return name;
    },
    isSelected(optionValue: string) {
        return Array.isArray(answer) ? answer.includes(optionValue) : answer === optionValue;
    },
    select(optionValue: string) {
        if (disabled || effectiveStatus === 'submitting' || type === 'text') {
            return;
        }

        if (type === 'multiple') {
            const selected = Array.isArray(answer) ? answer : [];
            value = selected.includes(optionValue)
                ? selected.filter((item) => item !== optionValue)
                : [...selected, optionValue];
            validationAttempt = undefined;
            return;
        }

        value = optionValue;
        validationAttempt = undefined;
    },
    setText(nextValue: string) {
        if (!disabled && effectiveStatus !== 'submitting' && type === 'text') {
            value = nextValue;
            validationAttempt = undefined;
        }
    },
    submit() {
        if (!disabled && effectiveStatus !== 'submitting') {
            form?.requestSubmit();
        }
    },
    cancel(event: MouseEvent) {
        if (!disabled && effectiveStatus !== 'submitting') {
            onCancel?.(event);
        }
    }
});

$effect.pre(() => {
    if (type !== previousType) {
        previousType = type;
        modeRevision += 1;
        value = type === 'multiple' ? [] : '';
        focused = false;
        return;
    }

    if (type === 'multiple' && !Array.isArray(value)) {
        value = [];
    } else if (type !== 'multiple' && typeof value !== 'string') {
        value = '';
    }
});

$effect(() => {
    type;
    if (!autofocus) {
        focused = false;
        return;
    }

    if (!form || focused || interactiveDisabled) {
        return;
    }

    let observer: MutationObserver | undefined;
    const focusFirstControl = () => {
        const control = form?.querySelector<HTMLElement>('[data-question-control]:not(:disabled)');
        control?.focus();
        focused = document.activeElement === control;
        if (focused) {
            observer?.disconnect();
        }
    };

    focusFirstControl();
    if (focused) {
        return;
    }

    observer = new MutationObserver(focusFirstControl);
    observer.observe(form, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled']
    });

    return () => observer.disconnect();
});

async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (context.disabled || context.busy) {
        return;
    }

    if (!context.canSubmit) {
        validationAttempt = {
            type,
            revision: modeRevision
        };
        queueMicrotask(() => {
            form?.querySelector<HTMLElement>('[data-question-control]:not(:disabled)')?.focus();
        });
        return;
    }

    validationAttempt = undefined;
    pending = true;
    try {
        await onSubmit(context.answer, event);
    } finally {
        pending = false;
    }
}

function normalizeAnswer(
    questionType: QuestionType,
    currentValue: QuestionAnswer | undefined
): QuestionAnswer {
    if (questionType === 'multiple') {
        return Array.isArray(currentValue) ? currentValue : [];
    }

    return typeof currentValue === 'string' ? currentValue : '';
}

function getValidationMessage(questionType: QuestionType) {
    if (questionType === 'multiple') {
        return 'Select at least one answer.';
    }

    return questionType === 'text' ? 'Enter an answer.' : 'Select an answer.';
}
</script>

<div
    data-ui="question"
    data-type={type}
    data-state={displayStatus}
    data-disabled={disabled || undefined}
    aria-busy={effectiveStatus === 'submitting'}
    class="w-full"
>
    <div
        data-state={displayStatus}
        class="max-h-0 overflow-hidden transition-[max-height] [transition-duration:var(--motion-duration-panel)] ease-[var(--ease-out)] motion-reduce:transition-none data-[state=error]:max-h-24"
    >
        <div
            data-ui="question-error"
            role={effectiveStatus === 'error' && !validationMessage ? 'alert' : undefined}
            aria-hidden={displayStatus !== 'error'}
            class={errorNoticeClass}
            data-state={displayStatus}
        >
            <CircleAlert size={14} strokeWidth={2} aria-hidden="true" />
            <span>{displayErrorMessage}</span>
        </div>
    </div>

    <form
        bind:this={form}
        {...rest}
        data-ui="question-form"
        data-type={type}
        data-state={displayStatus}
        data-disabled={disabled || undefined}
        aria-busy={effectiveStatus === 'submitting'}
        novalidate
        onsubmit={handleSubmit}
        class={cn(
            className,
            'relative w-full overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card text-foreground shadow-[var(--elevation-1)] ring-1 ring-inset ring-[color-mix(in_oklab,var(--color-border)_45%,transparent)] transition-[background-color,border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none data-[state=error]:border-[color-mix(in_srgb,var(--color-error)_70%,transparent)] data-[state=error]:shadow-[0_0_0_calc(var(--border-size)*2)_color-mix(in_srgb,var(--color-error)_25%,transparent),var(--elevation-1)]'
        )}
    >
        <p
            data-ui="question-validation-announcement"
            role="status"
            aria-live="polite"
            class="sr-only"
        >
            {validationMessage}
        </p>
        <fieldset {disabled} class="m-0 flex min-w-0 flex-col border-0 p-0">
            {@render children?.()}
        </fieldset>
    </form>
</div>

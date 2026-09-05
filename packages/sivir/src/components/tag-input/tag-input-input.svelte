<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TagInputInputProps } from '.';
    import { getTagInputContext } from './context.svelte';

    let {
        placeholder = 'Add a tag…',
        element = $bindable<HTMLInputElement | undefined>(undefined),
        class: className,
        disabled: disabledProp,
        'aria-label': ariaLabel,
        onblur,
        onkeydown,
        onpaste,
        ...rest
    }: TagInputInputProps = $props();

    const context = getTagInputContext();
    const disabled = $derived(disabledProp ?? context.disabled);

    function register(node: HTMLInputElement) {
        element = node;
        context.setInputElement(node);

        return () => {
            context.setInputElement(undefined);
        };
    }

    function handleInput(event: Event) {
        context.setDraft((event.currentTarget as HTMLInputElement).value);
    }

    function handleKeydown(event: KeyboardEvent) {
        onkeydown?.(event);

        if (event.defaultPrevented || disabled) {
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            context.commitDraft();

            return;
        }

        if (event.key === 'Backspace' && context.draft === '' && context.tags.length > 0) {
            event.preventDefault();
            context.removeAt(context.tags.length - 1);

            return;
        }

        if (event.key === 'Escape' && context.draft !== '') {
            event.preventDefault();
            context.setDraft('');

            return;
        }

        if (event.key.length === 1 && context.delimiters.includes(event.key)) {
            event.preventDefault();
            context.commitDraft();
        }
    }

    function splitPasted(value: string) {
        const separators = new Set([',', ';', '\n', ...context.delimiters]);
        const candidates: string[] = [];
        let current = '';

        for (const char of value) {
            if (separators.has(char)) {
                const trimmed = current.trim();

                if (trimmed !== '') {
                    candidates.push(trimmed);
                }

                current = '';
            } else {
                current += char;
            }
        }

        const tail = current.trim();

        if (tail !== '') {
            candidates.push(tail);
        }

        return candidates;
    }

    function handlePaste(event: ClipboardEvent) {
        onpaste?.(event);

        if (event.defaultPrevented || disabled || !context.addOnPaste) {
            return;
        }

        const text = event.clipboardData?.getData('text') ?? '';

        if (text === '') {
            return;
        }

        const candidates = splitPasted(text);

        if (candidates.length < 2) {
            return;
        }

        event.preventDefault();

        for (const candidate of candidates) {
            const added = context.add(candidate);

            if (!added && context.atMax) {
                break;
            }
        }
    }

    function handleBlur(event: FocusEvent) {
        onblur?.(event);

        if (event.defaultPrevented || disabled || !context.addOnBlur) {
            return;
        }

        context.commitDraft();
    }
</script>

<input
    {@attach register}
    {...rest}
    id={context.inputId}
    type="text"
    autocomplete="off"
    autocapitalize="off"
    spellcheck={false}
    value={context.draft}
    {placeholder}
    {disabled}
    aria-label={ariaLabel ?? placeholder}
    aria-describedby={context.describedBy}
    oninput={handleInput}
    onkeydown={handleKeydown}
    onpaste={handlePaste}
    onblur={handleBlur}
    data-ui="tag-input-input"
    class={cn(
        className,
        'min-w-24 flex-1 self-stretch bg-transparent py-1 text-[var(--color-field-foreground)] [font-size:var(--font-size-body)] outline-none placeholder:text-foreground-muted disabled:cursor-not-allowed'
    )}
/>

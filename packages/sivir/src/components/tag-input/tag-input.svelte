<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import type { TagInputProps } from '.';
    import { setTagInputContext } from './context.svelte';

    let {
        tags = $bindable([]),
        query = $bindable(''),
        max,
        allowDuplicates = false,
        disabled = false,
        label,
        description,
        error,
        name,
        required = false,
        variant = 'outline',
        validate,
        normalize,
        delimiters = [','],
        addOnBlur = true,
        addOnPaste = true,
        onTagsChange,
        onAdd,
        onRemove,
        onReject,
        id: idProp,
        class: className,
        children,
        ...rest
    }: TagInputProps = $props();

    const generatedId = $props.id();
    const rootId = $derived(idProp ?? `tag-input-${generatedId}`);
    const inputId = $derived(`${rootId}-input`);
    const descriptionId = $derived(`${rootId}-description`);
    const errorId = $derived(`${rootId}-error`);
    const describedBy = $derived(
        [description ? descriptionId : undefined, error ? errorId : undefined]
            .filter(Boolean)
            .join(' ') || undefined
    );

    let inputElement = $state<HTMLInputElement | undefined>(undefined);
    let spoken = $state('');

    const safeTags = $derived(Array.isArray(tags) ? tags : []);
    const atMax = $derived(max !== undefined && safeTags.length >= max);
    const controlClass = $derived(
        variant === 'secondary'
            ? 'border-transparent bg-secondary focus-within:border-[color-mix(in_srgb,var(--color-secondary)_45%,var(--color-primary))]'
            : 'border-[var(--color-input)] bg-[var(--color-field)] focus-within:border-primary'
    );

    function toCandidate(raw: string) {
        if (normalize) {
            return normalize(raw);
        }

        return raw.trim();
    }

    function emit(next: string[]) {
        tags = next;
        onTagsChange?.(next);
    }

    function add(raw: string) {
        if (disabled) {
            return false;
        }

        const candidate = toCandidate(raw);

        if (candidate === '') {
            return false;
        }

        if (!allowDuplicates && safeTags.includes(candidate)) {
            onReject?.({
                code: 'duplicate',
                reason: `"${candidate}" is already added.`,
                value: candidate
            });

            return false;
        }

        if (max !== undefined && safeTags.length >= max) {
            onReject?.({
                code: 'max-tags',
                reason: `Only ${max} ${max === 1 ? 'tag is' : 'tags are'} allowed.`,
                value: candidate
            });

            return false;
        }

        if (validate) {
            const result = validate(candidate);

            if (result === false) {
                onReject?.({
                    code: 'invalid',
                    reason: `"${candidate}" is not a valid tag.`,
                    value: candidate
                });

                return false;
            }

            if (typeof result === 'string' && result !== '') {
                onReject?.({
                    code: 'invalid',
                    reason: result,
                    value: candidate
                });

                return false;
            }
        }

        const next = [...safeTags, candidate];
        emit(next);
        query = '';
        spoken = `${candidate} added. ${next.length} ${next.length === 1 ? 'tag' : 'tags'} total.`;
        onAdd?.(candidate);

        return true;
    }

    function removeAt(index: number) {
        if (disabled) {
            return;
        }

        if (index < 0 || index >= safeTags.length) {
            return;
        }

        const removed = safeTags[index] ?? '';
        const next = safeTags.filter((_, position) => position !== index);
        emit(next);
        spoken = `${removed} removed. ${next.length} ${next.length === 1 ? 'tag' : 'tags'} total.`;
        onRemove?.(removed);
    }

    function removeValue(value: string) {
        const index = safeTags.indexOf(value);

        if (index >= 0) {
            removeAt(index);
        }
    }

    function commitDraft() {
        return add(query);
    }

    function focusInput() {
        inputElement?.focus({ preventScroll: true });
    }

    function handleFieldClick(event: MouseEvent) {
        const target = event.target as HTMLElement | null;

        if (target?.closest('[data-ui="tag-input-tag-remove"]')) {
            return;
        }

        if (!disabled) {
            focusInput();
        }
    }

    setTagInputContext({
        get tags() {
            return safeTags;
        },
        get disabled() {
            return disabled;
        },
        get inputId() {
            return inputId;
        },
        get draft() {
            return query;
        },
        get atMax() {
            return atMax;
        },
        get delimiters() {
            return delimiters;
        },
        get addOnBlur() {
            return addOnBlur;
        },
        get addOnPaste() {
            return addOnPaste;
        },
        get describedBy() {
            return describedBy;
        },
        setDraft(next: string) {
            query = next;
        },
        setInputElement(element: HTMLInputElement | undefined) {
            inputElement = element;
        },
        focusInput,
        add,
        commitDraft,
        removeAt,
        removeValue
    });
</script>

{#snippet field()}
    <div
        {...rest}
        id={rootId}
        data-ui="tag-input"
        data-variant={variant}
        data-disabled={disabled || undefined}
        data-invalid={error ? true : undefined}
        onclick={handleFieldClick}
        class={cn(
            className,
            'flex min-h-[var(--size-control-md)] w-full cursor-text flex-wrap items-center gap-1.5 rounded-[var(--radius-lg)] border px-2 py-1 transition-[background-color,border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none focus-within:shadow-[var(--focus-ring)] has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-[var(--opacity-disabled)]',
            controlClass,
            error && 'border-[var(--color-error)] focus-within:border-[var(--color-error)]'
        )}
    >
        {@render children?.()}
    </div>
    {#if name}
        {#each safeTags as tag, index (index)}
            <input type="hidden" {name} value={tag} {required} />
        {/each}
    {/if}
    <span role="status" aria-live="polite" class="sr-only">{spoken}</span>
{/snippet}

{#snippet meta()}
    {#if label}
        <label
            for={inputId}
            class="mb-0.5 select-none [font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] leading-none text-foreground [font-family:var(--font-sans),sans-serif]"
        >
            {label}
        </label>
    {/if}
    {@render field()}
    {#if error}
        <span
            id={errorId}
            role="alert"
            class="[font-size:var(--font-size-body)] [font-weight:var(--font-weight-body)] text-[var(--color-error)]"
        >
            {error}
        </span>
    {:else if description}
        <span
            id={descriptionId}
            class="[font-size:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)] text-foreground-muted"
        >
            {description}
        </span>
    {/if}
{/snippet}

{#if label || description || error}
    <div data-ui="tag-input-field" class="flex w-full flex-col gap-1">
        {@render meta()}
    </div>
{:else}
    {@render field()}
{/if}

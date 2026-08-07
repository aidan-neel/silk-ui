<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import Copy from '@lucide/svelte/icons/copy';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Tooltip from '@sivir-ui/svelte/components/tooltip';
    import { onDestroy } from 'svelte';
    import type { CopyButtonProps } from '.';

    let {
        text,
        label = 'Copy',
        copiedLabel = 'Copied',
        duration = 2000,
        variant = 'ghost',
        size = 'icon',
        class: className,
        oncopy,
        ...rest
    }: CopyButtonProps = $props();

    let copied = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    function fallbackCopy() {
        if (typeof document === 'undefined' || typeof document.execCommand !== 'function') {
            return false;
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        return copied;
    }

    async function copy() {
        let didCopy = false;
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
                didCopy = true;
            } catch {
                didCopy = fallbackCopy();
            }
        } else {
            didCopy = fallbackCopy();
        }
        if (!didCopy) {
            return;
        }

        copied = true;
        oncopy?.(text);
        clearTimeout(timer);
        timer = setTimeout(() => (copied = false), duration);
    }

    onDestroy(() => clearTimeout(timer));
</script>

<Tooltip.Root placement="top" delay={125} closeDelay={80}>
    <!-- Positioning/layout lives on the trigger wrapper so the tooltip anchors to
	     the same box the button actually renders in (e.g. an absolutely-placed
	     copy button in a code block). -->
    <Tooltip.Trigger showOnClick class={className}>
        <Button
            {...rest}
            type="button"
            {variant}
            {size}
            aria-label={copied ? copiedLabel : label}
            onclick={copy}
        >
            <!-- Copy ↔ Check morph: the two icons share one grid cell and cross-fade
			     with a scale + quarter-turn so one twists out as the other twists in. -->
            <span class="relative grid size-4 place-items-center">
                <Copy
                    size={15}
                    class={`col-start-1 row-start-1 transition-[transform,opacity] duration-200 ease-[var(--ease-out)] ${
                        copied ? '-rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
                    }`}
                />
                <Check
                    size={15}
                    class={`col-start-1 row-start-1 text-[var(--color-success)] transition-[transform,opacity] duration-200 ease-[var(--ease-out)] ${
                        copied ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'
                    }`}
                />
            </span>
        </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>{copied ? copiedLabel : label}</Tooltip.Content>
</Tooltip.Root>

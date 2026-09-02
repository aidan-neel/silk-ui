<!-- token-lint-disable-file -->
<script lang="ts">
    import { cn } from '@sivir-ui/svelte/utils';
    import { onMount } from 'svelte';
    import type { ShortcutProps } from '.';

    let { children, class: className, shortcut = '', ontrigger, ...rest }: ShortcutProps = $props();
    let element: HTMLElement;

    /** Maps keybinding tokens to the glyphs people recognise from native menus. */
    const GLYPHS: Record<string, string> = {
        cmd: '⌘',
        command: '⌘',
        meta: '⌘',
        ctrl: '⌃',
        control: '⌃',
        shift: '⇧',
        alt: '⌥',
        option: '⌥',
        opt: '⌥',
        enter: '↵',
        return: '↵',
        esc: 'esc',
        escape: 'esc',
        tab: '⇥',
        space: 'Space',
        up: '↑',
        down: '↓',
        left: '←',
        right: '→',
        backspace: '⌫',
        delete: '⌦',
        plus: '+'
    };

    const MODIFIERS = {
        cmd: 'meta',
        command: 'meta',
        meta: 'meta',
        ctrl: 'ctrl',
        control: 'ctrl',
        shift: 'shift',
        alt: 'alt',
        option: 'alt',
        opt: 'alt'
    } as const;

    const NAMED_KEYS: Record<string, string> = {
        enter: 'enter',
        return: 'enter',
        esc: 'escape',
        escape: 'escape',
        tab: 'tab',
        space: ' ',
        up: 'arrowup',
        down: 'arrowdown',
        left: 'arrowleft',
        right: 'arrowright',
        backspace: 'backspace',
        delete: 'delete',
        plus: '+'
    };

    type ParsedShortcut = {
        meta: boolean;
        ctrl: boolean;
        shift: boolean;
        alt: boolean;
        key: string;
        caps: string[];
    };

    function parseShortcut(value: string): ParsedShortcut | undefined {
        const tokens = value
            .split('+')
            .map((token) => token.trim().toLowerCase())
            .filter(Boolean);

        if (tokens.length === 0) {
            return undefined;
        }

        const parsed: ParsedShortcut = {
            meta: false,
            ctrl: false,
            shift: false,
            alt: false,
            key: '',
            caps: []
        };

        for (const token of tokens) {
            const modifier = MODIFIERS[token as keyof typeof MODIFIERS];
            if (modifier) {
                parsed[modifier] = true;
                parsed.caps.push(GLYPHS[token]);
                continue;
            }

            const key = NAMED_KEYS[token] ?? (token.length === 1 ? token : undefined);
            if (!key || parsed.key) {
                return undefined;
            }

            parsed.key = key;
            parsed.caps.push(GLYPHS[token] ?? token.toUpperCase());
        }

        return parsed.key ? parsed : undefined;
    }

    const parsed = $derived(parseShortcut(shortcut));
    const caps = $derived(parsed?.caps ?? []);

    function isEditableTarget(target: EventTarget | null) {
        if (!(target instanceof HTMLElement)) {
            return false;
        }
        return (
            target.matches('input, textarea, select') ||
            target.isContentEditable ||
            Boolean(target.closest('[contenteditable]:not([contenteditable="false"])'))
        );
    }

    function getOwner() {
        const owner = element.closest<HTMLElement>('button, a[href], [role="button"]');
        if (!owner) {
            return undefined;
        }
        if (
            (owner instanceof HTMLButtonElement && owner.disabled) ||
            owner.hasAttribute('disabled') ||
            owner.getAttribute('aria-disabled') === 'true'
        ) {
            return undefined;
        }
        return owner;
    }

    function handleKey(event: KeyboardEvent) {
        if (!parsed || event.repeat) {
            return;
        }

        const fromInput =
            event.target instanceof HTMLInputElement && event.target.type !== 'hidden';
        const allowFromInput = parsed.key === 'enter' || parsed.key === 'escape';

        if (isEditableTarget(event.target) && !(allowFromInput && fromInput)) {
            return;
        }

        if (
            event.key.toLowerCase() !== parsed.key ||
            event.metaKey !== parsed.meta ||
            event.ctrlKey !== parsed.ctrl ||
            event.shiftKey !== parsed.shift ||
            event.altKey !== parsed.alt
        ) {
            return;
        }

        const owner = ontrigger ? undefined : getOwner();
        if (!ontrigger && !owner) {
            return;
        }

        event.preventDefault();
        if (ontrigger) {
            ontrigger(event);
        } else {
            owner?.click();
        }
    }

    onMount(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    });
</script>

<kbd
    bind:this={element}
    {...rest}
    class={cn(
        className,
        'inline-flex h-4 min-w-4 shrink-0 select-none items-center justify-center rounded-[var(--radius-sm)] border border-border bg-card px-1 align-middle font-sans text-[length:var(--font-size-meta)] font-label leading-none text-foreground-muted',
        '[[data-variant=primary]_&]:border-transparent [[data-variant=primary]_&]:bg-[color-mix(in_oklab,var(--color-on-primary)_18%,transparent)] [[data-variant=primary]_&]:text-[var(--color-on-primary)]',
        '[[data-variant=destructive]_&]:border-transparent [[data-variant=destructive]_&]:bg-[color-mix(in_oklab,currentColor_16%,transparent)] [[data-variant=destructive]_&]:text-current'
    )}
>
    {#if children}
        {@render children()}
    {:else}
        {caps.join('')}
    {/if}
</kbd>

<script lang="ts">
    import Paperclip from '@lucide/svelte/icons/paperclip';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { AttachmentProps, AttachmentRejection } from '.';
    import { setAttachmentContext } from './context.svelte';

    let {
        files = $bindable([]),
        accept,
        multiple = true,
        maxFiles,
        maxSize,
        disabled = false,
        onReject,
        children,
        class: className,
        ondragenter,
        ondragover,
        ondragleave,
        ondrop,
        ...rest
    }: AttachmentProps = $props();

    let input: HTMLInputElement | undefined;
    let dragDepth = 0;
    let dragging = $state(false);

    function fileKey(file: File) {
        return `${file.name}\u0000${file.size}\u0000${file.lastModified}`;
    }

    function formatBytes(bytes: number) {
        if (bytes < 1024) {
            return `${bytes} B`;
        }
        const units = ['KB', 'MB', 'GB', 'TB'];
        let value = bytes / 1024;
        let unit = 0;
        while (value >= 1024 && unit < units.length - 1) {
            value /= 1024;
            unit += 1;
        }
        return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
    }

    function acceptsFile(file: File) {
        const rules = accept
            ?.split(',')
            .map((rule) => rule.trim().toLowerCase())
            .filter(Boolean);
        if (!rules?.length) {
            return true;
        }

        const name = file.name.toLowerCase();
        const type = file.type.toLowerCase();
        return rules.some((rule) => {
            if (rule.startsWith('.')) {
                return name.endsWith(rule);
            }
            if (rule.endsWith('/*')) {
                return type.startsWith(rule.slice(0, -1));
            }
            return type === rule;
        });
    }

    function addFiles(incoming: Iterable<File>) {
        if (disabled) {
            return;
        }

        const accepted: File[] = [];
        const rejections: AttachmentRejection[] = [];
        const keys = new Set(files.map(fileKey));
        const limit = Math.max(0, Math.min(multiple ? Infinity : 1, maxFiles ?? Infinity));

        for (const file of incoming) {
            const key = fileKey(file);
            if (keys.has(key)) {
                rejections.push({
                    file,
                    code: 'duplicate-file',
                    reason: 'A file with the same name, size, and modified date is already attached.'
                });
                continue;
            }
            if (!acceptsFile(file)) {
                rejections.push({
                    file,
                    code: 'file-invalid-type',
                    reason: `This file type is not accepted${accept ? ` (${accept})` : ''}.`
                });
                continue;
            }
            if (maxSize !== undefined && file.size > maxSize) {
                rejections.push({
                    file,
                    code: 'file-too-large',
                    reason: `This file is larger than the ${formatBytes(maxSize)} limit.`
                });
                continue;
            }
            if (files.length + accepted.length >= limit) {
                rejections.push({
                    file,
                    code: 'too-many-files',
                    reason: `Only ${limit} ${limit === 1 ? 'attachment is' : 'attachments are'} allowed.`
                });
                continue;
            }

            keys.add(key);
            accepted.push(file);
        }

        if (accepted.length) {
            files = [...files, ...accepted];
        }
        if (rejections.length) {
            onReject?.(rejections);
        }
    }

    function hasDraggedFiles(event: DragEvent) {
        return Array.from(event.dataTransfer?.types ?? []).includes('Files');
    }

    setAttachmentContext({
        get files() {
            return files;
        },
        set files(next: File[]) {
            files = next;
        },
        get disabled() {
            return disabled;
        },
        open() {
            if (!disabled) {
                input?.click();
            }
        },
        remove(file: File) {
            if (!disabled) {
                files = files.filter((candidate) => candidate !== file);
            }
        }
    });
</script>

<div
    {...rest}
    data-ui="attachment"
    data-state={dragging ? 'dragging' : 'idle'}
    data-disabled={disabled || undefined}
    ondragenter={(event) => {
        ondragenter?.(event);
        if (event.defaultPrevented || !hasDraggedFiles(event)) {
            return;
        }
        event.preventDefault();
        if (!disabled) {
            dragDepth += 1;
            dragging = true;
        }
    }}
    ondragover={(event) => {
        ondragover?.(event);
        if (event.defaultPrevented || !hasDraggedFiles(event)) {
            return;
        }
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
        }
    }}
    ondragleave={(event) => {
        ondragleave?.(event);
        if (disabled || !dragging) {
            return;
        }
        dragDepth = Math.max(0, dragDepth - 1);
        if (dragDepth === 0) {
            dragging = false;
        }
    }}
    ondrop={(event) => {
        ondrop?.(event);
        const hasFiles = hasDraggedFiles(event);
        const handled = event.defaultPrevented;
        event.preventDefault();
        dragDepth = 0;
        dragging = false;
        if (!handled && hasFiles && !disabled && event.dataTransfer) {
            addFiles(event.dataTransfer.files);
        }
    }}
    class={cn(className, 'relative min-w-0')}
>
    <input
        bind:this={input}
        class="hidden"
        type="file"
        tabindex={-1}
        {accept}
        {multiple}
        {disabled}
        onchange={(event) => {
            if (event.currentTarget.files) {
                addFiles(event.currentTarget.files);
            }
            event.currentTarget.value = '';
        }}
    />

    {@render children?.()}

    {#if dragging}
        <div
            data-ui="attachment-drop-overlay"
            data-state="dragging"
            aria-hidden="true"
            class="pointer-events-none absolute inset-1 z-10 grid place-items-center rounded-[var(--radius-lg)] border-2 border-dashed border-primary/60 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-card))] text-primary shadow-[var(--elevation-1)]"
        >
            <span
                class="flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 text-sm font-label shadow-[var(--elevation-control)]"
            >
                <Paperclip size={16} strokeWidth={2} />
                Drop files to attach
            </span>
        </div>
    {/if}
</div>

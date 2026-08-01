<script lang="ts">
    import CircleAlert from '@lucide/svelte/icons/circle-alert';
    import CircleCheck from '@lucide/svelte/icons/circle-check';
    import FileText from '@lucide/svelte/icons/file-text';
    import X from '@lucide/svelte/icons/x';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Spinner } from '@sivir-ui/svelte/components/spinner';
    import { cn } from '@sivir-ui/svelte/utils';
    import type { AttachmentItemProps } from '.';

    let {
        file,
        status = 'ready',
        progress,
        error,
        onRemove,
        removable = true,
        class: className,
        ...rest
    }: AttachmentItemProps = $props();

    const safeProgress = $derived(
        progress === undefined ? undefined : Math.min(100, Math.max(0, progress))
    );
    const preview = $derived.by(() => {
        const previewFile = file;
        return (node: HTMLImageElement) => {
            const url = URL.createObjectURL(previewFile);
            node.src = url;
            return () => URL.revokeObjectURL(url);
        };
    });
    const extension = $derived.by(() => {
        const dot = file.name.lastIndexOf('.');
        return dot > 0 && dot < file.name.length - 1
            ? file.name
                  .slice(dot + 1)
                  .toUpperCase()
                  .slice(0, 4)
            : 'FILE';
    });
    const statusText = $derived(
        status === 'complete'
            ? 'Complete'
            : status === 'error'
              ? error || 'Attachment failed'
              : 'Ready'
    );

    function formatBytes(bytes: number) {
        if (bytes < 1024) return `${bytes} B`;
        const units = ['KB', 'MB', 'GB', 'TB'];
        let value = bytes / 1024;
        let unit = 0;
        while (value >= 1024 && unit < units.length - 1) {
            value /= 1024;
            unit += 1;
        }
        return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
    }
</script>

<div
    {...rest}
    data-ui="attachment-item"
    data-state={status}
    class={cn(
        className,
        'flex min-w-0 items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-2 text-foreground data-[state=error]:border-[var(--color-error)]'
    )}
>
    <div
        class="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[var(--radius-md)] bg-secondary text-foreground-muted ring-1 ring-inset ring-black/10 dark:ring-white/10"
    >
        {#if file.type.startsWith('image/')}
            <img {@attach preview} alt="" draggable="false" class="size-full object-cover" />
        {:else}
            <FileText size={18} strokeWidth={1.75} aria-hidden="true" />
            <span
                class="absolute inset-x-0 bottom-0 truncate bg-card/90 px-1 py-0.5 text-center text-xs font-semibold leading-none text-foreground-muted"
            >
                {extension}
            </span>
        {/if}
    </div>

    <div class={cn('flex min-w-0 flex-1 flex-col', status === 'uploading' ? 'gap-2' : 'gap-1')}>
        <div class="flex min-w-0 items-baseline gap-2">
            <span class="min-w-0 flex-1 truncate text-sm font-medium" title={file.name}
                >{file.name}</span
            >
            <span
                class="flex shrink-0 items-center gap-1 text-xs tabular-nums text-foreground-muted"
            >
                {formatBytes(file.size)}
                {#if status === 'uploading'}
                    <Spinner size={14} aria-hidden="true" />
                {/if}
            </span>
        </div>

        {#if status !== 'uploading'}
            <div
                role={status === 'error' ? 'alert' : 'status'}
                class={cn(
                    'flex min-w-0 items-center gap-1 text-xs',
                    status === 'error'
                        ? 'text-[var(--color-error)]'
                        : status === 'complete'
                          ? 'text-[var(--color-success)]'
                          : 'text-foreground-muted'
                )}
            >
                {#if status === 'complete'}
                    <CircleCheck size={12} strokeWidth={2} aria-hidden="true" />
                {:else if status === 'error'}
                    <CircleAlert size={12} strokeWidth={2} aria-hidden="true" />
                {/if}
                <span class="truncate">{statusText}</span>
            </div>
        {/if}

        {#if status === 'uploading'}
            <div
                data-ui="attachment-progress"
                role="progressbar"
                aria-label={`Upload progress for ${file.name}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={safeProgress}
                class="h-1 w-full overflow-hidden rounded-full bg-secondary"
            >
                <div
                    class="h-full rounded-full bg-primary"
                    style:width={safeProgress === undefined ? '33.333%' : `${safeProgress}%`}
                ></div>
            </div>
        {/if}
    </div>

    {#if removable && onRemove}
        <Button
            type="button"
            variant="ghost"
            size="icon"
            data-ui="attachment-remove"
            aria-label={`Remove ${file.name}`}
            onclick={() => onRemove(file)}
            class="shrink-0 rounded-full text-foreground-muted hover:text-foreground"
        >
            <X size={15} strokeWidth={2} aria-hidden="true" />
        </Button>
    {/if}
</div>

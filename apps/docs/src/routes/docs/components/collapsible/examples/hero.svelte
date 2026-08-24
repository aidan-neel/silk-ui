<script lang="ts">
    import ChevronDown from '@lucide/svelte/icons/chevron-down';
    import * as Collapsible from '@sivir-ui/svelte/components/collapsible';

    let open = $state(true);
</script>

<div class="w-full max-w-96">
    <div class="space-y-4">
        <Collapsible.Root bind:open>
            <Collapsible.Trigger
                class="-mx-2 flex w-[calc(100%+1rem)] items-center justify-between rounded-[var(--radius-md)] px-2 py-2 text-left text-foreground transition-colors hover:bg-secondary"
            >
                <span class="[font-weight:var(--font-weight-label,500)]">Weekly sync, June 18</span>
                <ChevronDown
                    size={18}
                    class="transition-transform duration-200 {open ? '' : '-rotate-90'}"
                />
            </Collapsible.Trigger>
            <Collapsible.Content class="mt-2 space-y-3 pl-3">
                <p class="text-sm text-foreground-muted leading-relaxed">
                    Discussed progress on upcoming features, team capacity, and timeline. Reviewed
                    latest design feedback and aligned on next steps for the studio redesign
                    rollout.
                </p>
                <ul class="space-y-2 text-sm text-foreground-muted">
                    <li class="flex gap-2">
                        <span class="text-foreground-muted">•</span>
                        <span>Ship the studio redesign by end of quarter</span>
                    </li>
                    <li class="flex gap-2">
                        <span class="text-foreground-muted">•</span>
                        <span>Draft v2 migration guide for customers</span>
                    </li>
                    <li class="flex gap-2">
                        <span class="text-foreground-muted">•</span>
                        <span>Review pricing experiment results with finance</span>
                    </li>
                </ul>
            </Collapsible.Content>
        </Collapsible.Root>
    </div>
</div>

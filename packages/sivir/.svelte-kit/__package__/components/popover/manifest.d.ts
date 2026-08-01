import type { Manifest } from '@sivir-ui/svelte/_manifest/types';
/**
 * Popover.
 *
 * 1.0.0 -- initial.
 * 2.0.0 (aria fixes):
 *        - popover-title.svelte typo fixed (was breaking aria-labelledby
 *          across every popover-based component).
 *        - popover-content's aria-modal/aria-labelledby now conditional
 *          on role and aria-label.
 *        - popover-content gained role="none" support for wrappers that
 *          don't want any popup semantics.
 *        - popover-content's aria-modal can now be overridden via prop.
 *        - popover-trigger allows aria-controls/aria-label override
 *          (consumer-supplied values now win).
 *        - popover.svelte initializes scoped state with actual prop values
 *          (open/placement/hoverable/delay/closeDelay) -- fixes the
 *          hardcoded `open: false` bug.
 *        - Removed onpointerenter/onpointerleave from PopoverTriggerProps
 *          (button 3.0.0 deleted the typed props; consumers use the
 *          spread attribute path if they need them).
 */
export declare const manifest: Manifest;

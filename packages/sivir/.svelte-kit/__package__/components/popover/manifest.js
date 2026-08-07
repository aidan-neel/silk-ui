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
export const manifest = {
    name: 'popover',
    version: '2.0.0',
    visibility: 'public',
    description:
        'Floating content positioned by @floating-ui. Click or hover triggers, Title/Content subparts, click-outside + Escape dismiss, optional portal.',
    role: 'dialog',
    files: [
        'components/popover/popover.svelte',
        'components/popover/popover-trigger.svelte',
        'components/popover/popover-content.svelte',
        'components/popover/popover-title.svelte',
        'components/popover/context.svelte.ts',
        'components/popover/index.ts',
        'components/popover/manifest.ts'
    ],
    components: ['button'],
    shared: [
        'utils.clickOutside',
        'utils.cn',
        'utils.createContext',
        'utils.lockBodyBackground',
        'utils.lockBodyScroll',
        'utils.positionFloatingPanel',
        'utils.pushEscapeLayer',
        'utils.trapFocus',
        'transition'
    ],
    peerDependencies: {
        '@floating-ui/dom': '^1.0.0',
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

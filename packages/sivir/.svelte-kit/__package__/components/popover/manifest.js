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
 * 3.0.0 -- Popover.Root gained inert outside-document behavior, enabled by
 *          default for non-hover popovers and safe across nested and portaled
 *          layers. Set inert={false} to preserve non-modal outside interaction.
 * 3.0.1 -- Inert, focus trap, and scroll lock share the overlay primitives so
 *          nested page overflow containers lock and sibling overlay roots stay
 *          interactive.
 * 3.1.0 -- Content gained `dismissLayer` (default true). Set it false for
 *          triggers that must stay clickable while open; outside pointer
 *          dismissal still applies via `allowClickOutside`.
 * 3.2.0 -- Content registers its Escape layer one rank above the enclosing
 *          overlay, so menus opened inside a modal or sheet peel before
 *          their host instead of closing it.
 */
export const manifest = {
    name: 'popover',
    version: '3.2.0',
    visibility: 'public',
    description: 'Floating content positioned by @floating-ui. Click or hover triggers, Title/Content subparts, inert outside content, click-outside + Escape dismiss, optional portal.',
    role: 'dialog',
    files: [
        'components/popover/popover.svelte',
        'components/popover/popover-trigger.svelte',
        'components/popover/popover-content.svelte',
        'components/popover/popover-title.svelte',
        'components/popover/context.svelte.ts',
        'components/popover/inert.ts',
        'components/popover/index.ts',
        'components/popover/manifest.ts'
    ],
    components: ['button', '_internal/overlay'],
    shared: [
        'utils.clickOutside',
        'utils.cn',
        'utils.createContext',
        'utils.inertOutside',
        'utils.lockBodyBackground',
        'utils.lockBodyScroll',
        'utils.positionFloatingPanel',
        'utils.submenuPanelOffset',
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

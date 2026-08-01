/**
 * HoverCard -- thin popover wrapper for hover-revealed rich content
 * (link previews, member cards, etc.). Hardcodes `hoverable: true`,
 * defaults to a 200ms open / 150ms close delay, applies `role="dialog"`
 * with `aria-modal="false"` to the content, and ships panel-style
 * Content + Title + Description sub-components.
 *
 * Version history:
 *   1.0.0 -- initial standalone implementation.
 *   2.0.0 (F-29 collapse): rewritten as a popover wrapper. The public
 *         Root/Trigger/Content/Title/Description API and the
 *         `openDelay`/`closeDelay` props on Root are preserved. The
 *         trigger renders as `<a>` when `href` is passed (anchor mode)
 *         and `<span>` otherwise -- both shapes unchanged from 1.0.0.
 *
 *         Removed: the `HoverCardState` type export (was used only by
 *         the standalone implementation; no external consumers).
 *
 *         Behavioral notes for consumers:
 *         - `side` and `align` on HoverCard.Content are accepted for
 *           type-API stability but are NOT currently wired through
 *           popover's placement. A future minor release may either
 *           wire these or formally deprecate them.
 */
export const manifest = {
    name: 'hover-card',
    version: '2.0.0',
    visibility: 'public',
    description: 'Hover-revealed rich content card with delay + close-delay. Thin popover wrapper with role="dialog" aria-modal="false". Composes popover; ships its own Content + Title + Description for rich-content layout.',
    role: 'dialog',
    files: [
        'components/hover-card/hover-card.svelte',
        'components/hover-card/hover-card-content.svelte',
        'components/hover-card/hover-card-trigger.svelte',
        'components/hover-card/hover-card-title.svelte',
        'components/hover-card/hover-card-description.svelte',
        'components/hover-card/index.ts',
        'components/hover-card/manifest.ts'
    ],
    components: ['popover'],
    shared: ['utils.cn'],
    peerDependencies: {
        cnfast: '^0.0.8',
        svelte: '^5.0.0'
    }
};

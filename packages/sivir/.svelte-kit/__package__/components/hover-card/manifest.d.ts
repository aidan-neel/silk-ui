import type { Manifest } from '@sivir-ui/svelte/_manifest/types';
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
export declare const manifest: Manifest;

import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';

import Root from './code-block.svelte';
import Actions from './code-block-actions.svelte';
import Content from './code-block-content.svelte';
import Copy from './code-block-copy.svelte';
import Header from './code-block-header.svelte';
import List from './code-block-list.svelte';
import Trigger from './code-block-trigger.svelte';

/** One language entry for the high-level `tabs` prop. */
export type CodeBlockTab = {
    /** Visible tab label, e.g. "JavaScript". */
    label: string;
    /** Highlight.js language id (or alias), e.g. "javascript" / "py" / "c#". */
    lang: string;
    /** Raw source for this tab. */
    code: string;
    /** Stable tab id; defaults to `lang`. Needed when two tabs share a `lang`. */
    value?: string;
};

/** Where the built-in copy button sits. */
export type CodeBlockCopyPlacement = 'actionbar' | 'overlay' | 'inline';

/**
 * Syntax paint for the highlighted tokens.
 * - `sivir`: the built-in GitHub palette (light in light mode, dark in dark mode).
 * - `custom`: no token colors; load any `highlight.js/styles/*` theme instead.
 */
export type CodeBlockTheme = 'sivir' | 'custom';

/** Context shape shared with the subparts. */
export type CodeBlockRegistry = {
    /** Raw code per tab value, registered by each `Content` (Copy reads the active one). */
    codes: Record<string, string>;
    /** Highlight.js language id per tab value. */
    langs: Record<string, string>;
    /** The currently-active tab value. */
    active: string;
    /** Tab values in source order — drives the directional slide on swap. */
    order: string[];
    /** Whether the high-level root owns the shared panel surface. */
    contained: boolean;
    /** Set by List: a tab row is present, so language switches roll instead of sliding. */
    tabbed: boolean;
    /** Token paint; `custom` skips the built-in colors for a stock theme stylesheet. */
    theme: CodeBlockTheme;
};

export type CodeBlockProps = {
    /** Active tab id (bindable). Defaults to the first tab. */
    value?: string;
    /** High-level multi-language form. */
    tabs?: CodeBlockTab[];
    /** Single-snippet shorthand (ignored when `tabs` is set). */
    code?: string;
    /** Language for the single-snippet shorthand. */
    lang?: string;
    /** Render a line-number gutter. */
    showLineNumbers?: boolean;
    /**
     * Copy button placement:
     * - `actionbar` (default): in the header's action cluster.
     * - `overlay`: pinned to the top-right of the code body.
     * - `inline`: a single-line body with the copy centered on the far right.
     */
    copy?: CodeBlockCopyPlacement;
    /** Extra buttons placed left of the built-in copy button (high-level form). */
    actions?: Snippet;
    /**
     * Syntax paint:
     * - `sivir` (default): the built-in GitHub palette.
     * - `custom`: no token colors; load any `highlight.js/styles/*` theme instead.
     */
    theme?: CodeBlockTheme;
} & DefaultProps;

export type CodeBlockHeaderProps = DefaultProps;

export type CodeBlockListProps = DefaultProps;

export type CodeBlockTriggerProps = {
    /** Tab id; matches a `Content` value. */
    value: string;
    disabled?: boolean;
} & DefaultProps;

export type CodeBlockActionsProps = {
    /** Append the built-in copy button after `children`. */
    copy?: boolean;
} & DefaultProps;

export type CodeBlockCopyProps = {
    label?: string;
    copiedLabel?: string;
} & DefaultProps;

export type CodeBlockContentProps = {
    /** Tab id this panel belongs to. */
    value?: string;
    code: string;
    lang?: string;
    showLineNumbers?: boolean;
    /** Render the copy button in/over this panel (`overlay` or `inline`). */
    copyPlacement?: 'overlay' | 'inline';
} & DefaultProps;

export { default as CodeBlock } from './code-block.svelte';
export { Actions, Content, Copy, Header, List, Root, Trigger };
export default Root;

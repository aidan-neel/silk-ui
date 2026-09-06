import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

import Root from './file-diff.svelte';
import Content from './file-diff-content.svelte';
import Filename from './file-diff-filename.svelte';
import LineNumber from './file-diff-line-number.svelte';
import PlusMinus from './file-diff-plus-minus.svelte';
import Row from './file-diff-row.svelte';
import TopBar from './file-diff-top-bar.svelte';

export type FileDiffChangeType = 'context' | 'add' | 'remove';

export type FileDiffLine = {
    type: FileDiffChangeType;
    oldLineNumber?: number | null;
    newLineNumber?: number | null;
    content: string;
};

/**
 * Syntax paint for the highlighted row tokens.
 * - `sivir`: the built-in GitHub palette (light in light mode, dark in dark mode).
 * - `custom`: no token colors; load any `highlight.js/styles/*` theme instead.
 */
export type FileDiffTheme = 'sivir' | 'custom';

export type FileDiffContext = {
    lang: string;
    showLineNumbers: boolean;
    file: string;
    additions: number;
    deletions: number;
    /** Token paint; `custom` skips the built-in colors for a stock theme stylesheet. */
    theme: FileDiffTheme;
};

export type FileDiffRootProps = {
    /** File path shown in the top bar, e.g. "src/auth.ts". */
    file?: string;
    /** Highlight.js language id used for every row unless a row overrides it. */
    lang?: string;
    /** Addition count. Defaults to the number of `add` lines in `diff`. */
    additions?: number;
    /** Deletion count. Defaults to the number of `remove` lines in `diff`. */
    deletions?: number;
    /** High-level unified lines. When set, Root renders TopBar and Content itself. */
    diff?: FileDiffLine[];
    /** Render the old/new line-number gutters. */
    showLineNumbers?: boolean;
    /**
     * Syntax paint:
     * - `sivir` (default): the built-in GitHub palette.
     * - `custom`: no token colors; load any `highlight.js/styles/*` theme instead.
     */
    theme?: FileDiffTheme;
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export type FileDiffTopBarProps = {
    /** File path. Falls back to the Root `file` when omitted. */
    file?: string;
    /** Addition count. Falls back to the Root count when omitted. */
    additions?: number;
    /** Deletion count. Falls back to the Root count when omitted. */
    deletions?: number;
    /**
     * Trailing actions, pinned to the right edge. Passing children takes
     * over the row: the default filename and counts are omitted, so compose
     * them back explicitly with `Filename` and `PlusMinus` as needed.
     */
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export type FileDiffFilenameProps = {
    /** File path. Falls back to the Root `file` when omitted. */
    file?: string;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export type FileDiffPlusMinusProps = {
    /** Addition count. Falls back to the Root count when omitted. */
    additions?: number;
    /** Deletion count. Falls back to the Root count when omitted. */
    deletions?: number;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export type FileDiffContentProps = {
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export type FileDiffRowProps = {
    /** Row kind. Drives the tint, gutter bar, and sign. */
    type?: FileDiffChangeType;
    /** Old-file line number. Empty when nullish. */
    oldLine?: number | null;
    /** New-file line number. Empty when nullish. */
    newLine?: number | null;
    /** Raw source for the row. Highlighted with the Root (or row) language. */
    code?: string;
    /** Row-level language override. */
    lang?: string;
    children?: Snippet;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export type FileDiffLineNumberProps = {
    /** Line number. Renders an empty gutter cell when nullish. */
    value?: number | null;
    /** Number tone. Rows pass their own type; standalone use defaults to context. */
    tone?: FileDiffChangeType;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export { Content, Filename, LineNumber, PlusMinus, Root, Row, TopBar };
export default Root;

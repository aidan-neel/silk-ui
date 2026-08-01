export type MarkdownTableCell = {
    text?: string;
    tokens?: MarkdownToken[];
};

export type MarkdownToken = {
    type: string;
    raw?: string;
    text?: string;
    tokens?: MarkdownToken[];
    items?: MarkdownToken[];
    depth?: number;
    ordered?: boolean;
    start?: number | string;
    task?: boolean;
    checked?: boolean;
    href?: string;
    title?: string | null;
    lang?: string;
    block?: boolean;
    header?: MarkdownTableCell[];
    rows?: MarkdownTableCell[][];
    align?: Array<'center' | 'left' | 'right' | null>;
};

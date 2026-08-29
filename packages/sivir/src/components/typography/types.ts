import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type TypographyHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
    children: Snippet;
};

export type TypographyTextVariant = 'lead' | 'body' | 'supporting';

export type TypographyTextProps = HTMLAttributes<HTMLParagraphElement> & {
    children: Snippet;
    variant?: TypographyTextVariant;
};

export type TypographyInlineCodeProps = HTMLAttributes<HTMLElement> & {
    children: Snippet;
};

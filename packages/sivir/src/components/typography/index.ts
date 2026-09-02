import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import Description from './typography-description.svelte';
import H1 from './typography-h1.svelte';
import H2 from './typography-h2.svelte';
import H3 from './typography-h3.svelte';
import H4 from './typography-h4.svelte';
import H5 from './typography-h5.svelte';
import H6 from './typography-h6.svelte';
import InlineCode from './typography-inline-code.svelte';
import Metadata from './typography-metadata.svelte';
import Text from './typography-text.svelte';
import Title from './typography-title.svelte';

export type {
    TypographyHeadingProps,
    TypographyInlineCodeProps,
    TypographyTextProps,
    TypographyTextVariant
} from './types';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingTag = `h${HeadingLevel}`;

export type TypographyTitleProps = HTMLAttributes<HTMLHeadingElement> & {
    level: HeadingLevel;
    children: Snippet;
};

export type TypographyDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
    children: Snippet;
};

export type TypographyMetadataProps = HTMLAttributes<HTMLSpanElement> & {
    children: Snippet;
};

export { Description, H1, H2, H3, H4, H5, H6, InlineCode, Metadata, Text, Title };

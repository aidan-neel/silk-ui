import { persistedState } from 'svelte-persisted-state';

export type FontCategory = 'Sans serif' | 'Serif' | 'Monospace';
export type DocsFont = { name: string; category: FontCategory; family: string };

export const DEFAULT_FONT = 'Inter';

/**
 * Every family imported by app.css from Google Fonts. Only these can be
 * previewed — anything else would fall back to a system font.
 */
export const fonts: DocsFont[] = [
    ...[
        'DM Sans',
        'Geist',
        'Inter',
        'Instrument Sans',
        'Manrope',
        'Plus Jakarta Sans',
        'Outfit',
        'Space Grotesk',
        'Sora',
        'IBM Plex Sans',
        'Roboto',
        'Open Sans',
        'Lato',
        'Montserrat',
        'Poppins',
        'Nunito',
        'Work Sans',
        'Figtree',
        'Public Sans',
        'Noto Sans'
    ].map((name) => ({ name, category: 'Sans serif' as const, family: `'${name}', sans-serif` })),
    ...[
        'Lora',
        'Source Serif 4',
        'Fraunces',
        'Newsreader',
        'Merriweather',
        'Playfair Display',
        'Libre Baskerville',
        'DM Serif Text',
        'Crimson Pro',
        'EB Garamond'
    ].map((name) => ({ name, category: 'Serif' as const, family: `'${name}', serif` })),
    ...[
        'Geist Mono',
        'IBM Plex Mono',
        'JetBrains Mono',
        'Fira Code',
        'Source Code Pro',
        'Roboto Mono'
    ].map((name) => ({ name, category: 'Monospace' as const, family: `'${name}', monospace` }))
];

/** The typeface applied to `--font-sans` (and therefore `--font-header`) site-wide. */
export const selectedFont = persistedState('sivir-docs-font', DEFAULT_FONT);

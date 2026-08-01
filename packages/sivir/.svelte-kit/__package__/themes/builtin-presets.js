import { DEFAULT_THEME, THEME_VERSION } from './theme';
export const builtInThemePresets = [
    DEFAULT_THEME,
    {
        version: THEME_VERSION,
        slug: 'graphite',
        name: 'Graphite',
        description: 'Cool grayscale surfaces with a restrained slate accent.',
        publisher: 'Sivir UI',
        brand: '#4d607f',
        neutral: 'true',
        radius: 'default',
        density: 'default',
        motion: 'default',
        fontSans: 'Geist, sans-serif',
        fontMono: "'Geist Mono', monospace",
        fontHeader: 'Geist, sans-serif'
    },
    {
        version: THEME_VERSION,
        slug: 'grove',
        name: 'Grove',
        description: 'Botanical green accents with cool, compact surfaces.',
        publisher: 'Sivir UI',
        brand: '#2f7a54',
        neutral: 'cool',
        radius: 'default',
        density: 'compact',
        motion: 'subtle',
        fontSans: "'Plus Jakarta Sans', sans-serif",
        fontMono: "'IBM Plex Mono', monospace",
        fontHeader: "'Plus Jakarta Sans', sans-serif"
    },
    {
        version: THEME_VERSION,
        slug: 'linen',
        name: 'Linen',
        description: 'Warm paper-like neutrals with a refined rust accent.',
        publisher: 'Sivir UI',
        brand: '#a44a2f',
        neutral: 'warm',
        radius: 'rounded',
        density: 'comfortable',
        motion: 'expressive',
        fontSans: 'Manrope, sans-serif',
        fontMono: "'IBM Plex Mono', monospace",
        fontHeader: 'Lora, serif'
    }
];
export const defaultTheme = DEFAULT_THEME;

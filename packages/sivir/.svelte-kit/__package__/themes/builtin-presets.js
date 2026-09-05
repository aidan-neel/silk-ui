import { DEFAULT_THEME, THEME_VERSION } from './theme';
export const magicTheme = {
    version: THEME_VERSION,
    slug: 'magic',
    name: 'Magic',
    description: 'Compact warm-neutral system with an indigo accent and flat chrome.',
    publisher: 'Sivir UI',
    brand: '#1e42e6',
    neutral: 'warm',
    radius: 'default',
    density: 'compact',
    motion: 'subtle',
    fontSans: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#dedede',
            background: '#fafafa',
            secondary: '#efefee'
        },
        dark: {
            base: '#171717',
            border: '#1f1f1f',
            background: '#0f0f0f',
            secondary: '#1f1f1f'
        }
    },
    tokens: {
        shared: {
            '--radius-lg': '8px',
            '--radius-md': '6px',
            '--radius-sm': '4px',
            '--radius-xl': '12px'
        }
    },
    typography: {
        headerSize: 16,
        headerWeight: '600',
        roleWeights: {
            body: '500',
            label: '500',
            button: '500',
            badge: '500',
            description: '500'
        }
    },
    chrome: {
        shadows: false,
        primaryStroke: false,
        interactiveCursor: 'default'
    }
};
export const bitsyTheme = {
    version: THEME_VERSION,
    slug: 'bitsy',
    name: 'Bitsy',
    description: 'Comfortable rounded system with a graphite accent and flat stroked chrome.',
    publisher: 'Sivir UI',
    brand: '#5a5c63',
    neutral: 'warm',
    radius: 'rounded',
    density: 'comfortable',
    motion: 'expressive',
    fontSans: "'DM Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#d4d4d4',
            background: '#fdfdfc',
            secondary: '#efefee'
        },
        dark: {
            base: '#171717',
            border: '#2a2a2a',
            background: '#0a0a0a',
            secondary: '#252525'
        }
    },
    typography: {
        headerSize: 18,
        headerWeight: '600',
        roleWeights: {
            body: '500',
            label: '500',
            button: '600',
            badge: '500',
            description: '500'
        }
    },
    chrome: {
        shadows: false,
        primaryStroke: true,
        interactiveCursor: 'default'
    }
};
export const openTheme = {
    version: THEME_VERSION,
    slug: 'open',
    name: 'Open',
    description: 'Calm warm-neutral system with a graphite accent, Geist type, and flat controls.',
    publisher: 'Sivir UI',
    brand: '#333333',
    neutral: 'warm',
    radius: 'rounded',
    density: 'default',
    motion: 'subtle',
    fontSans: "'Geist', sans-serif",
    fontMono: "'Roboto Mono', monospace",
    fontHeader: 'var(--font-sans)',
    foundation: {
        light: {
            base: '#ffffff',
            border: '#ededed',
            background: '#ffffff',
            secondary: '#efefee',
            foreground: '#1c1c1b',
            foregroundMuted: '#787878',
            onPrimary: '#ffffff'
        },
        dark: {
            base: '#171717',
            border: '#262626',
            background: '#0a0a0a',
            secondary: '#252525',
            foreground: '#e6e6e6',
            foregroundMuted: '#a3a3a3',
            onPrimary: '#1a1a1a'
        }
    },
    tokens: {
        shared: {
            '--sivir-space-unit': '3.4px',
            '--radius-lg': '12px',
            '--radius-md': '10px',
            '--radius-xl': '14px',
            '--radius-sm': '7px'
        },
        dark: {
            '--color-primary': '#e6e6e6',
            '--color-primary-hover': 'color-mix(in srgb, #e6e6e6 78%, black)',
            '--color-ring': 'color-mix(in srgb, #e6e6e6 30%, transparent)'
        }
    },
    typography: {
        headerSize: 18,
        headerWeight: '500',
        roleWeights: {
            body: '500',
            label: '500',
            button: '500',
            badge: '500',
            description: '500'
        }
    },
    chrome: {
        surfaceShadows: false,
        controlShadows: false
    }
};
export const builtInThemePresets = [
    DEFAULT_THEME,
    magicTheme,
    bitsyTheme,
    openTheme
];
export const defaultTheme = DEFAULT_THEME;

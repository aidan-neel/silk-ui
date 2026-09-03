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
            secondary: '#efefee',
            muted: '#f0f0f0'
        },
        dark: {
            base: '#171717',
            border: '#1f1f1f',
            background: '#0f0f0f',
            secondary: '#1f1f1f',
            muted: '#1a1a1a'
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
            secondary: '#efefee',
            muted: '#f7f7f5'
        },
        dark: {
            base: '#171717',
            border: '#2a2a2a',
            background: '#0a0a0a',
            secondary: '#252525',
            muted: '#1a1a1a'
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
export const builtInThemePresets = [DEFAULT_THEME, magicTheme, bitsyTheme];
export const defaultTheme = DEFAULT_THEME;

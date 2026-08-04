export const THEME_VERSION = 2 as const;

export const neutralTemperatures = ['cool', 'true', 'warm'] as const;
export const radiusScales = ['sharp', 'default', 'rounded'] as const;
export const densities = ['compact', 'default', 'comfortable'] as const;
export const motionFeels = ['none', 'subtle', 'default', 'expressive'] as const;

export type NeutralTemp = (typeof neutralTemperatures)[number];
export type RadiusScale = (typeof radiusScales)[number];
export type Density = (typeof densities)[number];
export type MotionFeel = (typeof motionFeels)[number];

/** The single, versioned public authoring contract for Sivir themes. */
export type Theme = {
    version: typeof THEME_VERSION;
    slug: string;
    name: string;
    description: string;
    publisher?: string;
    /** Primary/accent color as a six-digit hex value. */
    brand: string;
    neutral: NeutralTemp;
    radius: RadiusScale;
    density: Density;
    motion: MotionFeel;
    /** CSS font-family values, including fallbacks when desired. */
    fontSans: string;
    fontMono: string;
    fontHeader: string;
};

export type ThemeRecord = Theme & {
    id: string;
    createdAt: string;
    updatedAt: string;
};

/** Matches the public axes baked into ui.css exactly. */
export const DEFAULT_THEME: Theme = {
    version: THEME_VERSION,
    slug: 'default',
    name: 'Default',
    description: 'Sivir default — a calm, warm-neutral interface system.',
    publisher: 'Sivir UI',
    brand: '#1f9be6',
    neutral: 'warm',
    radius: 'default',
    density: 'default',
    motion: 'default',
    fontSans: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    fontHeader: 'var(--font-sans)'
};

const RADII: Record<RadiusScale, readonly [string, string, string, string]> = {
    sharp: ['2px', '4px', '6px', '8px'],
    default: ['6px', '8px', '10px', '14px'],
    rounded: ['10px', '14px', '18px', '24px']
};

const DENSITY_UNIT: Record<Density, string> = {
    compact: '3.2px',
    default: '3.6px',
    comfortable: '4px'
};

type MotionSet = {
    hover: string;
    menu: string;
    panel: string;
    sheet: string;
    overlay: string;
    toastIn: string;
    toastOut: string;
};

const MOTION: Record<MotionFeel, MotionSet> = {
    none: {
        hover: '0ms',
        menu: '0ms',
        panel: '0ms',
        sheet: '0ms',
        overlay: '0ms',
        toastIn: '0ms',
        toastOut: '0ms'
    },
    subtle: {
        hover: '90ms',
        menu: '30ms',
        panel: '130ms',
        sheet: '220ms',
        overlay: '90ms',
        toastIn: '240ms',
        toastOut: '180ms'
    },
    default: {
        hover: '120ms',
        menu: '40ms',
        panel: '180ms',
        sheet: '320ms',
        overlay: '120ms',
        toastIn: '320ms',
        toastOut: '240ms'
    },
    expressive: {
        hover: '180ms',
        menu: '120ms',
        panel: '260ms',
        sheet: '400ms',
        overlay: '160ms',
        toastIn: '400ms',
        toastOut: '300ms'
    }
};

const NEUTRAL_STEPS = [0, 10, 50, 100, 150, 300, 500, 900] as const;
type NeutralRamp = Record<(typeof NEUTRAL_STEPS)[number], string>;

// Immutable source values keep generated declarations acyclic in every mode.
const NEUTRALS: Record<NeutralTemp, { light: NeutralRamp; dark: NeutralRamp }> = {
    warm: {
        light: {
            0: 'hsl(0 0% 100%)',
            10: 'hsl(60 11.1% 99.2%)',
            50: 'hsl(60 11.1% 96.5%)',
            100: 'hsl(60 6.2% 93.7%)',
            150: 'hsl(60 4.2% 90.6%)',
            300: 'hsl(60 4.4% 82.4%)',
            500: 'hsl(60 3% 41.5%)',
            900: 'hsl(60 5.7% 10.4%)'
        },
        dark: {
            0: 'hsl(0 0% 5%)',
            10: 'hsl(60 11.1% 99.2%)',
            50: 'hsl(0 0% 10%)',
            100: 'hsl(0 0% 13%)',
            150: 'hsl(0 0% 15.7%)',
            300: 'hsl(0 0% 22.7%)',
            500: 'hsl(0 0% 65%)',
            900: 'hsl(0 0% 93%)'
        }
    },
    true: {
        light: {
            0: 'hsl(0 0% 100%)',
            10: 'hsl(0 0% 99%)',
            50: 'hsl(0 0% 96%)',
            100: 'hsl(0 0% 93%)',
            150: 'hsl(0 0% 90%)',
            300: 'hsl(0 0% 82%)',
            500: 'hsl(0 0% 42%)',
            900: 'hsl(0 0% 10%)'
        },
        dark: {
            0: 'hsl(0 0% 5%)',
            10: 'hsl(0 0% 7%)',
            50: 'hsl(0 0% 10%)',
            100: 'hsl(0 0% 13%)',
            150: 'hsl(0 0% 16%)',
            300: 'hsl(0 0% 23%)',
            500: 'hsl(0 0% 65%)',
            900: 'hsl(0 0% 93%)'
        }
    },
    cool: {
        light: {
            0: 'hsl(220 20% 100%)',
            10: 'hsl(220 20% 99%)',
            50: 'hsl(220 16% 96%)',
            100: 'hsl(220 14% 93%)',
            150: 'hsl(220 12% 90%)',
            300: 'hsl(220 10% 81%)',
            500: 'hsl(220 8% 42%)',
            900: 'hsl(220 12% 10%)'
        },
        dark: {
            0: 'hsl(220 12% 5%)',
            10: 'hsl(220 12% 7%)',
            50: 'hsl(220 11% 10%)',
            100: 'hsl(220 10% 13%)',
            150: 'hsl(220 9% 16%)',
            300: 'hsl(220 8% 23%)',
            500: 'hsl(220 7% 65%)',
            900: 'hsl(220 10% 93%)'
        }
    }
};

function block(selector: string, declarations: string[]): string {
    return `${selector} {\n${declarations.map((declaration) => `\t${declaration}`).join('\n')}\n}\n`;
}

function neutralDeclarations(ramp: NeutralRamp) {
    return NEUTRAL_STEPS.map((step) => `--sivir-neutral-${step}: ${ramp[step]};`);
}

function brandDeclarations(brand: string, mode: 'light' | 'dark') {
    const isDefault = brand.toLowerCase() === DEFAULT_THEME.brand;
    return [
        `--color-primary: ${brand};`,
        // Keep default hover in lockstep with baked ui.css and WCAG AA on white labels.
        `--color-primary-hover: ${isDefault ? '#1270ad' : `color-mix(in srgb, ${brand} 78%, black)`};`,
        `--color-ring: color-mix(in srgb, ${brand} 30%, transparent);`,
        `--sivir-blue-500: ${
            isDefault
                ? mode === 'light'
                    ? 'hsl(212.2 100% 64.5%)'
                    : 'hsl(216.6 100% 67.8%)'
                : brand
        };`,
        `--sivir-blue-50: ${
            isDefault
                ? mode === 'light'
                    ? 'hsl(218.8 100% 96.7%)'
                    : 'hsl(217.1 52.5% 15.7%)'
                : `color-mix(in srgb, ${brand} 12%, ${mode === 'light' ? 'white' : 'black'})`
        };`
    ];
}

/** Scales a `Nms` motion token (keeps `0ms` as-is). */
function scaleMotionMs(value: string, factor: number): string {
    const n = Number.parseFloat(value);
    if (!Number.isFinite(n) || n === 0) {
        return value;
    }
    return `${Math.round(n * factor)}ms`;
}

/** Generates complete, acyclic overrides for every public theme axis. */
export function themeToCss(themeInput: Theme): string {
    const theme = parseTheme(themeInput);
    const [radiusSm, radiusMd, radiusLg, radiusXl] = RADII[theme.radius];
    const motion = MOTION[theme.motion];
    const shared = [
        `--font-sans: ${theme.fontSans};`,
        `--font-mono: ${theme.fontMono};`,
        `--font-header: ${theme.fontHeader};`,
        `--radius-sm: ${radiusSm};`,
        `--radius-md: ${radiusMd};`,
        `--radius-lg: ${radiusLg};`,
        `--radius-xl: ${radiusXl};`,
        `--sivir-space-unit: ${DENSITY_UNIT[theme.density]};`,
        `--motion-duration-hover: ${motion.hover};`,
        `--motion-duration-menu: ${motion.menu};`,
        `--motion-duration-panel: ${motion.panel};`,
        `--motion-duration-sheet: ${motion.sheet};`,
        `--motion-duration-sheet-out: ${scaleMotionMs(motion.sheet, 0.7)};`,
        `--motion-duration-overlay: ${motion.overlay};`,
        `--motion-duration-toast-in: ${motion.toastIn};`,
        `--motion-duration-toast-out: ${motion.toastOut};`
    ];

    return (
        block(':root,\n.dark', shared) +
        block(':root', [
            ...brandDeclarations(theme.brand, 'light'),
            ...neutralDeclarations(NEUTRALS[theme.neutral].light)
        ]) +
        block('.dark', [
            ...brandDeclarations(theme.brand, 'dark'),
            ...neutralDeclarations(NEUTRALS[theme.neutral].dark)
        ])
    );
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new TypeError(`Invalid theme: ${field} must be a non-empty string.`);
    }
    return value;
}

function enumValue<T extends string>(value: unknown, field: string, values: readonly T[]): T {
    if (typeof value !== 'string' || !values.includes(value as T)) {
        throw new TypeError(`Invalid theme: ${field} must be one of ${values.join(', ')}.`);
    }
    return value as T;
}

/** Validates untrusted registry/local-storage JSON and returns a normalized theme. */
export function parseTheme(value: unknown): Theme {
    if (!isRecord(value)) {
        throw new TypeError('Invalid theme: expected an object.');
    }
    if (value.version !== THEME_VERSION) {
        throw new TypeError(`Invalid theme: version must be ${THEME_VERSION}.`);
    }

    const slug = requiredString(value.slug, 'slug');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new TypeError(
            'Invalid theme: slug must contain lowercase letters, numbers, or hyphens.'
        );
    }

    const brand = requiredString(value.brand, 'brand').toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(brand)) {
        throw new TypeError('Invalid theme: brand must be a six-digit hex color.');
    }

    const theme: Theme = {
        version: THEME_VERSION,
        slug,
        name: requiredString(value.name, 'name'),
        description: typeof value.description === 'string' ? value.description : '',
        brand,
        neutral: enumValue(value.neutral, 'neutral', neutralTemperatures),
        radius: enumValue(value.radius, 'radius', radiusScales),
        density: enumValue(value.density, 'density', densities),
        motion: enumValue(value.motion, 'motion', motionFeels),
        fontSans: requiredString(value.fontSans, 'fontSans'),
        fontMono: requiredString(value.fontMono, 'fontMono'),
        fontHeader: requiredString(value.fontHeader, 'fontHeader')
    };
    if (typeof value.publisher === 'string' && value.publisher.trim()) {
        theme.publisher = value.publisher;
    }
    return theme;
}

export function isTheme(value: unknown): value is Theme {
    try {
        parseTheme(value);
        return true;
    } catch {
        return false;
    }
}

export declare const THEME_VERSION: 2;
export declare const neutralTemperatures: readonly ["cool", "true", "warm"];
export declare const radiusScales: readonly ["sharp", "default", "rounded"];
export declare const densities: readonly ["compact", "default", "comfortable"];
export declare const motionFeels: readonly ["none", "subtle", "default", "expressive"];
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
export declare const DEFAULT_THEME: Theme;
/** Generates complete, acyclic overrides for every public theme axis. */
export declare function themeToCss(themeInput: Theme): string;
/** Validates untrusted registry/local-storage JSON and returns a normalized theme. */
export declare function parseTheme(value: unknown): Theme;
export declare function isTheme(value: unknown): value is Theme;

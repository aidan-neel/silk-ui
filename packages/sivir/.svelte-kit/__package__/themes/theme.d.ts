export declare const THEME_VERSION: 4;
/** Versions accepted by parseTheme. Older theme payloads keep working. */
export declare const SUPPORTED_THEME_VERSIONS: readonly [2, 3, 4];
export type SupportedThemeVersion = (typeof SUPPORTED_THEME_VERSIONS)[number];
export declare const neutralTemperatures: readonly ["cool", "true", "warm"];
export declare const radiusScales: readonly ["sharp", "default", "rounded"];
export declare const densities: readonly ["compact", "default", "comfortable"];
export declare const motionFeels: readonly ["none", "subtle", "default", "expressive"];
export declare const themeFontWeights: readonly ["400", "500", "600", "700"];
export declare const interactiveCursors: readonly ["default", "pointer"];
export type NeutralTemp = (typeof neutralTemperatures)[number];
export type RadiusScale = (typeof radiusScales)[number];
export type Density = (typeof densities)[number];
export type MotionFeel = (typeof motionFeels)[number];
export type ThemeFontWeight = (typeof themeFontWeights)[number];
export type InteractiveCursor = (typeof interactiveCursors)[number];
export type ThemeFoundationPalette = {
    base?: string;
    border?: string;
    background?: string;
    secondary?: string;
    foreground?: string;
    foregroundMuted?: string;
    onPrimary?: string;
};
export type ThemeFoundation = {
    light?: ThemeFoundationPalette;
    dark?: ThemeFoundationPalette;
};
export type ThemeTokenOverrides = {
    light?: Record<string, string>;
    dark?: Record<string, string>;
    shared?: Record<string, string>;
};
export type ThemeRoleWeights = {
    body?: ThemeFontWeight;
    label?: ThemeFontWeight;
    button?: ThemeFontWeight;
    badge?: ThemeFontWeight;
    description?: ThemeFontWeight;
};
export type ThemeTypography = {
    headerSize?: number;
    headerWeight?: ThemeFontWeight;
    roleWeights?: ThemeRoleWeights;
};
export type ThemeChrome = {
    shadows?: boolean;
    /** Shadows on cards, floating menus, and other surfaces (`--elevation-1`, `--elevation-float`). */
    surfaceShadows?: boolean;
    /** Shadows on inputs, buttons, and similar controls (`--elevation-control`, `--elevation-button-outline`). */
    controlShadows?: boolean;
    /** Shadows on dialogs and sheets (`--elevation-modal`). */
    dialogShadows?: boolean;
    /** Removes the traveling hover highlight from menus and collections. */
    travelingHighlight?: false;
    primaryStroke?: boolean;
    interactiveCursor?: InteractiveCursor;
};
/** The single, versioned public authoring contract for Sivir themes. */
export type Theme = {
    version: SupportedThemeVersion;
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
    /** Optional per-mode surface colors. Mirrors the theme studio foundation section. */
    foundation?: ThemeFoundation;
    /** Optional raw token overrides keyed by CSS custom property name. */
    tokens?: ThemeTokenOverrides;
    /** Optional type-scale overrides. Mirrors the theme studio typography section. */
    typography?: ThemeTypography;
    /** Optional chrome flags. Mirrors the theme studio chrome section. */
    chrome?: ThemeChrome;
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
/** Upgrades a v2 theme to v3 without changing its rendered CSS. */
export declare function migrateThemeV2ToV3(theme: Theme): Theme;
/** Upgrades a v3 theme to v4, dropping the removed `foundation.muted` surface. */
export declare function migrateThemeV3ToV4(theme: Theme): Theme;
export declare function isTheme(value: unknown): value is Theme;

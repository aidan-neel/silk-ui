export const colorTokenDefinitions = [
    {
        name: '--sivir-neutral-0',
        label: 'Neutral 0',
        group: 'Palette',
        fallback: 'hsl(0 0% 100%)',
        darkFallback: 'hsl(0 0% 5%)'
    },
    {
        name: '--sivir-neutral-10',
        label: 'Neutral 10',
        group: 'Palette',
        fallback: 'hsl(60 11.1% 99.2%)'
    },
    {
        name: '--sivir-neutral-50',
        label: 'Neutral 50',
        group: 'Palette',
        fallback: 'hsl(60 11.1% 96.5%)',
        darkFallback: 'hsl(0 0% 10%)'
    },
    {
        name: '--sivir-neutral-100',
        label: 'Neutral 100',
        group: 'Palette',
        fallback: 'hsl(60 6.2% 93.7%)',
        darkFallback: 'hsl(0 0% 13%)'
    },
    {
        name: '--sivir-neutral-150',
        label: 'Neutral 150',
        group: 'Palette',
        fallback: 'hsl(60 4.2% 90.6%)',
        darkFallback: 'hsl(0 0% 15.7%)'
    },
    {
        name: '--sivir-neutral-300',
        label: 'Neutral 300',
        group: 'Palette',
        fallback: 'hsl(60 4.4% 82.4%)',
        darkFallback: 'hsl(0 0% 22.7%)'
    },
    {
        name: '--sivir-neutral-500',
        label: 'Neutral 500',
        group: 'Palette',
        fallback: 'hsl(60 3% 41.5%)',
        darkFallback: 'hsl(0 0% 65%)'
    },
    {
        name: '--sivir-neutral-900',
        label: 'Neutral 900',
        group: 'Palette',
        fallback: 'hsl(60 5.7% 10.4%)',
        darkFallback: 'hsl(0 0% 93%)'
    },
    {
        name: '--sivir-blue-50',
        label: 'Blue 50',
        group: 'Palette',
        fallback: 'hsl(218.8 100% 96.7%)',
        darkFallback: 'hsl(217.1 52.5% 15.7%)'
    },
    {
        name: '--sivir-blue-500',
        label: 'Blue 500',
        group: 'Palette',
        fallback: 'hsl(212.2 100% 64.5%)',
        darkFallback: 'hsl(216.6 100% 67.8%)'
    },
    {
        name: '--sivir-success',
        label: 'Success',
        group: 'Palette',
        fallback: 'hsl(148.7 42.2% 42.7%)',
        darkFallback: 'hsl(149.7 39.4% 49.2%)'
    },
    {
        name: '--sivir-warning',
        label: 'Warning',
        group: 'Palette',
        fallback: 'hsl(36.1 64.8% 47.8%)',
        darkFallback: 'hsl(37.3 72.6% 55.7%)'
    },
    {
        name: '--sivir-error',
        label: 'Error',
        group: 'Palette',
        fallback: 'hsl(0 57.7% 56.5%)',
        darkFallback: 'hsl(0 66.7% 63.5%)'
    },
    {
        name: '--color-background',
        label: 'Background',
        group: 'Surfaces',
        fallback: 'var(--sivir-neutral-10)',
        darkFallback: 'hsl(0 0% 4%)'
    },
    {
        name: '--color-card',
        label: 'Card',
        group: 'Surfaces',
        fallback: 'var(--sivir-neutral-0)',
        darkFallback: 'hsl(0 0% 9%)'
    },
    {
        name: '--color-panel',
        label: 'Panel',
        group: 'Surfaces',
        fallback: 'var(--sivir-neutral-0)',
        darkFallback: 'hsl(0 0% 11.5%)'
    },
    {
        name: '--color-muted',
        label: 'Muted',
        group: 'Surfaces',
        fallback: 'var(--sivir-neutral-50)',
        darkFallback: 'hsl(0 0% 7%)'
    },
    {
        name: '--color-secondary',
        label: 'Secondary',
        group: 'Surfaces',
        fallback: 'var(--sivir-neutral-100)',
        darkFallback: 'hsl(0 0% 14.5%)'
    },
    {
        name: '--color-field',
        label: 'Field',
        group: 'Surfaces',
        fallback: 'var(--color-card)',
        darkFallback: 'var(--color-secondary)'
    },
    {
        name: '--color-field-hover',
        label: 'Field hover',
        group: 'Surfaces',
        fallback: 'var(--color-muted)',
        darkFallback: 'hsl(0 0% 17.5%)'
    },
    {
        name: '--color-field-foreground',
        label: 'Field text',
        group: 'Surfaces',
        fallback: 'var(--color-foreground)'
    },
    {
        name: '--color-foreground',
        label: 'Text',
        group: 'Text',
        fallback: 'var(--sivir-neutral-900)'
    },
    {
        name: '--color-foreground-muted',
        label: 'Muted text',
        group: 'Text',
        fallback: 'var(--sivir-neutral-500)'
    },
    {
        name: '--color-tooltip',
        label: 'Tooltip',
        group: 'Text',
        fallback: 'var(--sivir-neutral-900)'
    },
    {
        name: '--color-tooltip-foreground',
        label: 'Tooltip text',
        group: 'Text',
        fallback: 'var(--sivir-neutral-0)'
    },
    {
        name: '--color-primary',
        label: 'Brand',
        group: 'Brand',
        fallback: '#1e78e6'
    },
    {
        name: '--color-primary-hover',
        label: 'Brand hover',
        group: 'Brand',
        fallback: 'color-mix(in srgb, var(--color-primary) 78%, black)'
    },
    {
        name: '--color-on-primary',
        label: 'On brand',
        group: 'Brand',
        fallback: 'hsl(0 0% 100%)'
    },
    {
        name: '--color-accent-tint',
        label: 'Tint',
        group: 'Brand',
        fallback: 'var(--sivir-blue-50)'
    },
    {
        name: '--color-ring',
        label: 'Focus ring',
        group: 'Brand',
        fallback: 'color-mix(in srgb, var(--color-primary) 30%, transparent)'
    },
    {
        name: '--color-border',
        label: 'Border',
        group: 'Borders',
        fallback: 'var(--sivir-neutral-150)',
        darkFallback: 'hsl(0 0% 16.5%)'
    },
    {
        name: '--color-border-strong',
        label: 'Strong border',
        group: 'Borders',
        fallback: 'var(--sivir-neutral-300)',
        darkFallback: 'hsl(0 0% 26%)'
    },
    {
        name: '--color-input',
        label: 'Input',
        group: 'Borders',
        fallback: 'var(--sivir-neutral-300)',
        darkFallback: 'hsl(0 0% 24%)'
    },
    {
        name: '--color-success',
        label: 'Success',
        group: 'Status',
        fallback: 'var(--sivir-success)'
    },
    {
        name: '--color-warning',
        label: 'Warning',
        group: 'Status',
        fallback: 'var(--sivir-warning)'
    },
    {
        name: '--color-error',
        label: 'Error',
        group: 'Status',
        fallback: 'var(--sivir-error)'
    },
    {
        name: '--color-info',
        label: 'Info',
        group: 'Status',
        fallback: 'var(--sivir-blue-500)'
    },
    {
        name: '--color-overlay',
        label: 'Overlay',
        group: 'Status',
        fallback: 'rgb(0 0 0 / 0.18)',
        darkFallback: 'rgb(0 0 0 / 0.55)'
    }
] as const;

export const spacingTokenDefinitions = [
    {
        name: '--sivir-space-unit',
        label: 'Base space',
        group: 'Spacing',
        fallback: '3.6px',
        min: 2,
        max: 8,
        step: 0.1
    },
    {
        name: '--sivir-space-1',
        label: 'Space 1',
        group: 'Spacing',
        fallback: 'calc(var(--sivir-space-unit) * 1)',
        min: 0,
        max: 48,
        step: 0.1
    },
    {
        name: '--sivir-space-2',
        label: 'Space 2',
        group: 'Spacing',
        fallback: 'calc(var(--sivir-space-unit) * 2)',
        min: 0,
        max: 48,
        step: 0.1
    },
    {
        name: '--sivir-space-3',
        label: 'Space 3',
        group: 'Spacing',
        fallback: 'calc(var(--sivir-space-unit) * 3)',
        min: 0,
        max: 64,
        step: 0.1
    },
    {
        name: '--sivir-space-4',
        label: 'Space 4',
        group: 'Spacing',
        fallback: 'calc(var(--sivir-space-unit) * 4)',
        min: 0,
        max: 64,
        step: 0.1
    },
    {
        name: '--sivir-space-5',
        label: 'Space 5',
        group: 'Spacing',
        fallback: 'calc(var(--sivir-space-unit) * 5)',
        min: 0,
        max: 80,
        step: 0.1
    },
    {
        name: '--sivir-space-6',
        label: 'Space 6',
        group: 'Spacing',
        fallback: 'calc(var(--sivir-space-unit) * 6)',
        min: 0,
        max: 80,
        step: 0.1
    },
    {
        name: '--sivir-space-8',
        label: 'Space 8',
        group: 'Spacing',
        fallback: 'calc(var(--sivir-space-unit) * 8)',
        min: 0,
        max: 96,
        step: 0.1
    },
    {
        name: '--sivir-space-10',
        label: 'Space 10',
        group: 'Spacing',
        fallback: 'calc(var(--sivir-space-unit) * 10)',
        min: 0,
        max: 96,
        step: 0.1
    },
    {
        name: '--size-control-sm',
        label: 'Small control',
        group: 'Controls',
        fallback: 'var(--sivir-space-8)',
        min: 16,
        max: 64,
        step: 1
    },
    {
        name: '--size-control-md',
        label: 'Medium control',
        group: 'Controls',
        fallback: 'calc(var(--sivir-space-8) + var(--sivir-space-2))',
        min: 16,
        max: 72,
        step: 1
    },
    {
        name: '--size-control-lg',
        label: 'Large control',
        group: 'Controls',
        fallback: 'var(--sivir-space-10)',
        min: 16,
        max: 80,
        step: 1
    },
    {
        name: '--size-icon-md',
        label: 'Icon',
        group: 'Controls',
        fallback: 'var(--sivir-space-8)',
        min: 12,
        max: 48,
        step: 1
    },
    {
        name: '--size-hairline',
        label: 'Hairline',
        group: 'Controls',
        fallback: '2px',
        min: 1,
        max: 4,
        step: 0.5
    },
    {
        name: '--radius-sm',
        label: 'Small radius',
        group: 'Corners',
        fallback: '6px',
        min: 0,
        max: 32,
        step: 1
    },
    {
        name: '--radius-md',
        label: 'Medium radius',
        group: 'Corners',
        fallback: '8px',
        min: 0,
        max: 32,
        step: 1
    },
    {
        name: '--radius-lg',
        label: 'Large radius',
        group: 'Corners',
        fallback: '10px',
        min: 0,
        max: 40,
        step: 1
    },
    {
        name: '--radius-xl',
        label: 'XL radius',
        group: 'Corners',
        fallback: '14px',
        min: 0,
        max: 48,
        step: 1
    },
    {
        name: '--border-size',
        label: 'Border width',
        group: 'Stroke',
        fallback: '1px',
        min: 0,
        max: 4,
        step: 1
    }
] as const;

export const easingOptions = [
    {
        label: 'Ease out',
        value: 'cubic-bezier(0.23, 1, 0.32, 1)'
    },
    {
        label: 'Press',
        value: 'cubic-bezier(0.22, 1, 0.36, 1)'
    },
    {
        label: 'Ease in',
        value: 'cubic-bezier(0.55, 0, 1, 0.45)'
    },
    {
        label: 'Ease in-out',
        value: 'cubic-bezier(0.77, 0, 0.175, 1)'
    },
    {
        label: 'Standard',
        value: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    {
        label: 'Decelerate',
        value: 'cubic-bezier(0, 0, 0.2, 1)'
    },
    {
        label: 'Accelerate',
        value: 'cubic-bezier(0.4, 0, 1, 1)'
    },
    {
        label: 'Snappy',
        value: 'cubic-bezier(0.16, 1, 0.3, 1)'
    },
    {
        label: 'Soft',
        value: 'cubic-bezier(0.33, 1, 0.68, 1)'
    },
    {
        label: 'Emphasized',
        value: 'cubic-bezier(0.2, 0, 0, 1)'
    },
    {
        label: 'Linear',
        value: 'linear'
    }
] as const;

export const animationTokenDefinitions = [
    {
        name: '--motion-duration-hover',
        label: 'Hover',
        group: 'Speed',
        fallback: '120ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-menu',
        label: 'Menu',
        group: 'Speed',
        fallback: '40ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-panel',
        label: 'Panel',
        group: 'Speed',
        fallback: '180ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-sheet',
        label: 'Sheet',
        group: 'Speed',
        fallback: '320ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-sheet-out',
        label: 'Sheet close',
        group: 'Speed',
        fallback: '220ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-overlay',
        label: 'Overlay',
        group: 'Speed',
        fallback: '120ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-toast-in',
        label: 'Toast in',
        group: 'Speed',
        fallback: '320ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-toast-out',
        label: 'Toast out',
        group: 'Speed',
        fallback: '240ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-panel-in',
        label: 'Panel open',
        group: 'Speed',
        fallback: '110ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-panel-out',
        label: 'Panel close',
        group: 'Speed',
        fallback: '150ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-modal-in',
        label: 'Modal open',
        group: 'Speed',
        fallback: '180ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-modal-out',
        label: 'Modal close',
        group: 'Speed',
        fallback: '110ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-press',
        label: 'Press duration',
        group: 'Speed',
        fallback: '160ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-duration-item',
        label: 'Item',
        group: 'Speed',
        fallback: '160ms',
        kind: 'duration',
        min: 0,
        max: 600,
        step: 10
    },
    {
        name: '--motion-panel-y',
        label: 'Panel offset',
        group: 'Movement',
        fallback: '2px',
        kind: 'length',
        min: 0,
        max: 16,
        step: 1
    },
    {
        name: '--motion-panel-scale-start',
        label: 'Start scale',
        group: 'Movement',
        fallback: '0.97',
        kind: 'scale',
        min: 0.8,
        max: 1,
        step: 0.01
    },
    {
        name: '--motion-press-px',
        label: 'Press distance',
        group: 'Movement',
        fallback: '2px',
        kind: 'length',
        min: 0,
        max: 12,
        step: 1
    },
    {
        name: '--ease-out',
        label: 'Ease out',
        group: 'Easing',
        fallback: 'cubic-bezier(0.23, 1, 0.32, 1)',
        kind: 'ease'
    },
    {
        name: '--ease-press',
        label: 'Press ease',
        group: 'Easing',
        fallback: 'cubic-bezier(0.22, 1, 0.36, 1)',
        kind: 'ease'
    },
    {
        name: '--ease-in-out',
        label: 'Ease in-out',
        group: 'Easing',
        fallback: 'cubic-bezier(0.77, 0, 0.175, 1)',
        kind: 'ease'
    }
] as const;

export type ColorTokenName = (typeof colorTokenDefinitions)[number]['name'];
export type SpacingTokenName = (typeof spacingTokenDefinitions)[number]['name'];
export type AnimationTokenName = (typeof animationTokenDefinitions)[number]['name'];
export type ColorTokenDefinition = (typeof colorTokenDefinitions)[number];
export type SpacingTokenDefinition = (typeof spacingTokenDefinitions)[number];
export type AnimationTokenDefinition = (typeof animationTokenDefinitions)[number];

export type TokenGroup<T> = {
    label: string;
    tokens: T[];
};

export type ParsedCssColor = {
    hex: string;
    alpha: number;
};

export const colorTokenGroups = groupTokens(colorTokenDefinitions);
export const spacingTokenGroups = groupTokens(spacingTokenDefinitions);
export const animationTokenGroups = groupTokens(animationTokenDefinitions);

export function groupTokens<T extends { group: string }>(tokens: readonly T[]): TokenGroup<T>[] {
    const groups: TokenGroup<T>[] = [];
    const indexByLabel = new Map<string, number>();

    for (const token of tokens) {
        const existing = indexByLabel.get(token.group);
        if (existing === undefined) {
            indexByLabel.set(token.group, groups.length);
            groups.push({
                label: token.group,
                tokens: [token]
            });
            continue;
        }

        groups[existing]?.tokens.push(token);
    }

    return groups;
}

export function formatPx(value: number): string {
    const rounded = Math.round(value * 10) / 10;
    return `${rounded}px`;
}

export function formatMs(value: number): string {
    return `${Math.round(value)}ms`;
}

export function formatScale(value: number): string {
    return String(Math.round(value * 100) / 100);
}

export function formatCssColor(hex: string, alpha: number): string {
    const normalized = hex.toLowerCase();
    if (alpha >= 0.995) {
        return normalized;
    }

    const rgb = hexToRgb(normalized);
    if (!rgb) {
        return normalized;
    }

    const [red, green, blue] = rgb;
    const roundedAlpha = Math.round(Math.max(0, Math.min(1, alpha)) * 100) / 100;
    return `rgb(${red} ${green} ${blue} / ${roundedAlpha})`;
}

export function parseDurationMs(value: string): number {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
        return 0;
    }

    const parsed = Number.parseFloat(trimmed);
    if (!Number.isFinite(parsed)) {
        return 0;
    }

    if (trimmed.endsWith('ms')) {
        return parsed;
    }

    if (trimmed.endsWith('s')) {
        return parsed * 1000;
    }

    return parsed;
}

export function parseScale(value: string): number {
    const parsed = Number.parseFloat(value.trim());
    if (!Number.isFinite(parsed)) {
        return 1;
    }

    return parsed;
}

export function normalizeEase(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '');
}

export function matchingEase(value: string): string {
    const normalized = normalizeEase(value);
    const match = easingOptions.find((option) => normalizeEase(option.value) === normalized);
    if (match) {
        return match.value;
    }

    return value.trim();
}

export function parsePxLength(value: string, resolveVar: (name: string) => string): number {
    return parsePxLengthValue(value, resolveVar, new Set());
}

export function parseCssColor(
    value: string,
    resolveVar: (name: string) => string
): ParsedCssColor | null {
    return parseCssColorValue(value, resolveVar, new Set());
}

function parsePxLengthValue(
    value: string,
    resolveVar: (name: string) => string,
    seen: Set<string>
): number {
    const trimmed = value.trim();
    if (!trimmed) {
        return 0;
    }

    const cssVar = parseCssVar(trimmed);
    if (cssVar) {
        if (seen.has(cssVar.name)) {
            return cssVar.fallback ? parsePxLengthValue(cssVar.fallback, resolveVar, seen) : 0;
        }

        seen.add(cssVar.name);
        const resolved = resolveVar(cssVar.name).trim();
        if (resolved) {
            return parsePxLengthValue(resolved, resolveVar, seen);
        }

        if (cssVar.fallback) {
            return parsePxLengthValue(cssVar.fallback, resolveVar, seen);
        }

        return 0;
    }

    if (trimmed.startsWith('calc(') && trimmed.endsWith(')')) {
        return parseCalcPx(trimmed.slice(5, -1).trim(), resolveVar, seen);
    }

    const parsed = Number.parseFloat(trimmed);
    if (!Number.isFinite(parsed)) {
        return 0;
    }

    return parsed;
}

function parseCalcPx(
    expression: string,
    resolveVar: (name: string) => string,
    seen: Set<string>
): number {
    const times = expression.match(/^(.+?)\s*\*\s*([0-9.]+)$/);
    if (times?.[1] && times[2]) {
        return parsePxLengthValue(times[1], resolveVar, seen) * Number(times[2]);
    }

    const plus = expression.match(/^(.+?)\s*\+\s*(.+)$/);
    if (plus?.[1] && plus[2]) {
        return (
            parsePxLengthValue(plus[1], resolveVar, seen) +
            parsePxLengthValue(plus[2], resolveVar, seen)
        );
    }

    return parsePxLengthValue(expression, resolveVar, seen);
}

function parseCssColorValue(
    value: string,
    resolveVar: (name: string) => string,
    seen: Set<string>
): ParsedCssColor | null {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    const named = namedColor(trimmed);
    if (named) {
        return named;
    }

    const cssVar = parseCssVar(trimmed);
    if (cssVar) {
        if (seen.has(cssVar.name)) {
            return cssVar.fallback ? parseCssColorValue(cssVar.fallback, resolveVar, seen) : null;
        }

        seen.add(cssVar.name);
        const resolved = resolveVar(cssVar.name).trim();
        if (resolved) {
            return parseCssColorValue(resolved, resolveVar, seen);
        }

        if (cssVar.fallback) {
            return parseCssColorValue(cssVar.fallback, resolveVar, seen);
        }

        return null;
    }

    if (trimmed.toLowerCase().startsWith('color-mix(')) {
        return parseColorMix(trimmed, resolveVar, seen);
    }

    const hex = parseHex(trimmed);
    if (hex) {
        return {
            hex,
            alpha: 1
        };
    }

    const rgb = parseRgb(trimmed);
    if (rgb) {
        return rgb;
    }

    return parseHsl(trimmed);
}

function parseColorMix(
    value: string,
    resolveVar: (name: string) => string,
    seen: Set<string>
): ParsedCssColor | null {
    const match = value
        .trim()
        .match(/^color-mix\(\s*in\s+srgb\s*,\s*(.+)\s+([0-9.]+)%\s*,\s*(.+)\s*\)$/i);
    if (!match?.[1] || !match[2] || !match[3]) {
        return null;
    }

    const amount = Number(match[2]) / 100;
    if (!Number.isFinite(amount)) {
        return null;
    }

    const first = parseCssColorValue(match[1], resolveVar, seen);
    if (!first) {
        return null;
    }

    const secondName = match[3].trim().toLowerCase();
    if (secondName === 'transparent') {
        return {
            hex: first.hex,
            alpha: first.alpha * amount
        };
    }

    const second = parseCssColorValue(match[3], resolveVar, seen);
    if (!second) {
        return null;
    }

    return {
        hex: mixHex(first.hex, second.hex, amount),
        alpha: first.alpha * amount + second.alpha * (1 - amount)
    };
}

function parseCssVar(value: string): { name: string; fallback: string } | null {
    const match = value.trim().match(/^var\(\s*(--[a-z0-9-]+)(?:\s*,\s*((?:.|\n)+))?\s*\)$/i);
    if (!match?.[1]) {
        return null;
    }

    return {
        name: match[1],
        fallback: match[2]?.trim() ?? ''
    };
}

function namedColor(value: string): ParsedCssColor | null {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'white') {
        return {
            hex: '#ffffff',
            alpha: 1
        };
    }

    if (normalized === 'black') {
        return {
            hex: '#000000',
            alpha: 1
        };
    }

    if (normalized === 'transparent') {
        return {
            hex: '#000000',
            alpha: 0
        };
    }

    return null;
}

function parseHex(value: string): string | null {
    const normalized = value.trim().toLowerCase();
    if (/^#[0-9a-f]{6}$/.test(normalized)) {
        return normalized;
    }

    if (/^#[0-9a-f]{3}$/.test(normalized)) {
        return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
    }

    return null;
}

function parseRgb(value: string): ParsedCssColor | null {
    const match = value
        .trim()
        .match(
            /^rgba?\(\s*([0-9.]+%?)[\s,]+([0-9.]+%?)[\s,]+([0-9.]+%?)(?:\s*[,/]\s*([0-9.]+)%?)?\s*\)$/i
        );
    if (!match?.[1] || !match[2] || !match[3]) {
        return null;
    }

    const red = parseRgbChannel(match[1]);
    const green = parseRgbChannel(match[2]);
    const blue = parseRgbChannel(match[3]);
    if (red === null || green === null || blue === null) {
        return null;
    }

    return {
        hex: rgbToHex(red, green, blue),
        alpha: parseAlpha(match[4])
    };
}

function parseHsl(value: string): ParsedCssColor | null {
    const match = value
        .trim()
        .match(
            /^hsla?\(\s*([0-9.]+)(?:deg)?[\s,]+([0-9.]+)%[\s,]+([0-9.]+)%(?:\s*[,/]\s*([0-9.]+)%?)?\s*\)$/i
        );
    if (!match?.[1] || !match[2] || !match[3]) {
        return null;
    }

    const hue = Number(match[1]);
    const sat = Number(match[2]);
    const light = Number(match[3]);
    if (!Number.isFinite(hue) || !Number.isFinite(sat) || !Number.isFinite(light)) {
        return null;
    }

    return {
        hex: hslToHex(hue, sat, light),
        alpha: parseAlpha(match[4])
    };
}

function parseRgbChannel(value: string): number | null {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
        return null;
    }

    if (value.trim().endsWith('%')) {
        return Math.round((parsed / 100) * 255);
    }

    return parsed;
}

function parseAlpha(value: string | undefined): number {
    if (value === undefined) {
        return 1;
    }

    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
        return 1;
    }

    if (parsed > 1) {
        return Math.max(0, Math.min(1, parsed / 100));
    }

    return Math.max(0, Math.min(1, parsed));
}

function hexToRgb(hex: string): [number, number, number] | null {
    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) {
        return null;
    }

    return [
        Number.parseInt(normalized.slice(0, 2), 16),
        Number.parseInt(normalized.slice(2, 4), 16),
        Number.parseInt(normalized.slice(4, 6), 16)
    ];
}

function rgbToHex(red: number, green: number, blue: number): string {
    const toHex = (channel: number) =>
        Math.round(Math.max(0, Math.min(255, channel)))
            .toString(16)
            .padStart(2, '0');

    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function mixHex(left: string, right: string, amountLeft: number): string {
    const leftRgb = hexToRgb(left);
    const rightRgb = hexToRgb(right);
    if (!leftRgb || !rightRgb) {
        return left;
    }

    const amountRight = 1 - amountLeft;
    return rgbToHex(
        leftRgb[0] * amountLeft + rightRgb[0] * amountRight,
        leftRgb[1] * amountLeft + rightRgb[1] * amountRight,
        leftRgb[2] * amountLeft + rightRgb[2] * amountRight
    );
}

function hslToHex(hue: number, sat: number, light: number): string {
    const s = sat / 100;
    const l = light / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (hue < 60) {
        r = c;
        g = x;
    } else if (hue < 120) {
        r = x;
        g = c;
    } else if (hue < 180) {
        g = c;
        b = x;
    } else if (hue < 240) {
        g = x;
        b = c;
    } else if (hue < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

import type { CommonStyle, LayoutStyle, TypographyStyle } from './types';

export function createCommonStyle(): CommonStyle {
    return {
        display: { base: 'block' },
        width: { base: 'auto' },
        maxWidth: { base: 'none' },
        minHeight: { base: 'none' },
        padding: { base: '0' },
        surface: { base: 'transparent' },
        border: { base: 'none' },
        radius: { base: 'none' },
        visibility: { base: 'visible' }
    };
}

export function createLayoutStyle(): LayoutStyle {
    return {
        direction: { base: 'column' },
        columns: { base: '1' },
        gap: { base: '0' },
        align: { base: 'stretch' },
        justify: { base: 'start' },
        wrap: { base: 'nowrap' }
    };
}

export function createTypographyStyle(): TypographyStyle {
    return {
        size: { base: 'base' },
        weight: { base: 'normal' },
        align: { base: 'left' },
        tone: { base: 'default' },
        leading: { base: 'normal' }
    };
}

import type {
    AlignValue,
    BorderValue,
    ColumnsValue,
    CommonStyle,
    DesignNode,
    DirectionValue,
    DisplayValue,
    JustifyValue,
    LayoutStyle,
    LineHeightValue,
    MaxWidthValue,
    MinHeightValue,
    RadiusValue,
    Responsive,
    SpaceValue,
    SurfaceValue,
    TextAlignValue,
    TextSizeValue,
    TextToneValue,
    TextWeightValue,
    TypographyStyle,
    VisibilityValue,
    WidthValue,
    WrapValue
} from '../document/types';

type ClassMap<T extends string> = Readonly<Record<T, readonly string[]>>;

const DISPLAY_CLASSES = {
    block: ['block'],
    flex: ['flex'],
    grid: ['grid']
} as const satisfies ClassMap<DisplayValue>;

const WIDTH_CLASSES = {
    auto: ['w-auto'],
    full: ['w-full'],
    fit: ['w-fit']
} as const satisfies ClassMap<WidthValue>;

const MAX_WIDTH_CLASSES = {
    none: ['max-w-none'],
    sm: ['max-w-sm'],
    md: ['max-w-md'],
    lg: ['max-w-lg'],
    xl: ['max-w-xl'],
    '2xl': ['max-w-2xl'],
    screen: ['max-w-screen-2xl']
} as const satisfies ClassMap<MaxWidthValue>;

const MIN_HEIGHT_CLASSES = {
    none: ['min-h-0'],
    screen: ['min-h-screen']
} as const satisfies ClassMap<MinHeightValue>;

const PADDING_CLASSES = {
    '0': ['p-0'],
    '1': ['p-1'],
    '2': ['p-2'],
    '3': ['p-3'],
    '4': ['p-4'],
    '6': ['p-6'],
    '8': ['p-8'],
    '12': ['p-12']
} as const satisfies ClassMap<SpaceValue>;

const SURFACE_CLASSES = {
    transparent: ['bg-transparent'],
    background: ['bg-background'],
    card: ['bg-card'],
    muted: ['bg-secondary'],
    primary: ['bg-primary']
} as const satisfies ClassMap<SurfaceValue>;

const BORDER_CLASSES = {
    none: ['border-0'],
    default: ['border', 'border-border'],
    strong: ['border', 'border-border-strong']
} as const satisfies ClassMap<BorderValue>;

const RADIUS_CLASSES = {
    none: ['rounded-none'],
    sm: ['rounded-sm'],
    md: ['rounded-md'],
    lg: ['rounded-lg'],
    xl: ['rounded-xl'],
    full: ['rounded-full']
} as const satisfies ClassMap<RadiusValue>;

const VISIBILITY_CLASSES = {
    visible: ['visible'],
    hidden: ['invisible']
} as const satisfies ClassMap<VisibilityValue>;

const DIRECTION_CLASSES = {
    row: ['flex-row'],
    column: ['flex-col']
} as const satisfies ClassMap<DirectionValue>;

const COLUMNS_CLASSES = {
    '1': ['grid-cols-1'],
    '2': ['grid-cols-2'],
    '3': ['grid-cols-3'],
    '4': ['grid-cols-4'],
    '6': ['grid-cols-6'],
    '12': ['grid-cols-12']
} as const satisfies ClassMap<ColumnsValue>;

const GAP_CLASSES = {
    '0': ['gap-0'],
    '1': ['gap-1'],
    '2': ['gap-2'],
    '3': ['gap-3'],
    '4': ['gap-4'],
    '6': ['gap-6'],
    '8': ['gap-8'],
    '12': ['gap-12']
} as const satisfies ClassMap<SpaceValue>;

const ALIGN_CLASSES = {
    start: ['items-start'],
    center: ['items-center'],
    end: ['items-end'],
    stretch: ['items-stretch']
} as const satisfies ClassMap<AlignValue>;

const JUSTIFY_CLASSES = {
    start: ['justify-start'],
    center: ['justify-center'],
    end: ['justify-end'],
    between: ['justify-between']
} as const satisfies ClassMap<JustifyValue>;

const WRAP_CLASSES = {
    nowrap: ['flex-nowrap'],
    wrap: ['flex-wrap']
} as const satisfies ClassMap<WrapValue>;

const TEXT_SIZE_CLASSES = {
    xs: ['text-xs'],
    sm: ['text-sm'],
    base: ['text-base'],
    lg: ['text-lg'],
    xl: ['text-xl'],
    '2xl': ['text-2xl'],
    '3xl': ['text-3xl']
} as const satisfies ClassMap<TextSizeValue>;

const TEXT_WEIGHT_CLASSES = {
    normal: ['font-normal'],
    medium: ['font-medium'],
    semibold: ['font-semibold'],
    bold: ['font-bold']
} as const satisfies ClassMap<TextWeightValue>;

const TEXT_ALIGN_CLASSES = {
    left: ['text-left'],
    center: ['text-center'],
    right: ['text-right']
} as const satisfies ClassMap<TextAlignValue>;

const TEXT_TONE_CLASSES = {
    default: ['text-foreground'],
    muted: ['text-foreground-muted'],
    subtle: ['text-foreground-subtle'],
    primary: ['text-primary'],
    success: ['text-success'],
    warning: ['text-warning'],
    danger: ['text-error']
} as const satisfies ClassMap<TextToneValue>;

const LINE_HEIGHT_CLASSES = {
    tight: ['leading-tight'],
    normal: ['leading-normal'],
    relaxed: ['leading-relaxed']
} as const satisfies ClassMap<LineHeightValue>;

export const TAILWIND_CLASS_MAPS = {
    display: DISPLAY_CLASSES,
    width: WIDTH_CLASSES,
    maxWidth: MAX_WIDTH_CLASSES,
    minHeight: MIN_HEIGHT_CLASSES,
    padding: PADDING_CLASSES,
    surface: SURFACE_CLASSES,
    border: BORDER_CLASSES,
    radius: RADIUS_CLASSES,
    visibility: VISIBILITY_CLASSES,
    direction: DIRECTION_CLASSES,
    columns: COLUMNS_CLASSES,
    gap: GAP_CLASSES,
    align: ALIGN_CLASSES,
    justify: JUSTIFY_CLASSES,
    wrap: WRAP_CLASSES,
    textSize: TEXT_SIZE_CLASSES,
    textWeight: TEXT_WEIGHT_CLASSES,
    textAlign: TEXT_ALIGN_CLASSES,
    textTone: TEXT_TONE_CLASSES,
    lineHeight: LINE_HEIGHT_CLASSES
} as const;

export function resolveResponsiveValue<T>(
    value: Responsive<T>,
    breakpoint: 'base' | 'md' | 'lg'
): T {
    if (breakpoint === 'lg') {
        return value.lg ?? value.md ?? value.base;
    }

    if (breakpoint === 'md') {
        return value.md ?? value.base;
    }

    return value.base;
}

function responsiveClassNames<T extends string>(
    value: Responsive<T>,
    classMap: ClassMap<T>
): readonly string[] {
    const classes = [...classMap[value.base]];

    if (value.md !== undefined) {
        classes.push(...classMap[value.md].map((className) => `md:${className}`));
    }

    if (value.lg !== undefined) {
        classes.push(...classMap[value.lg].map((className) => `lg:${className}`));
    }

    return classes;
}

export function commonStyleClassNames(style: CommonStyle): readonly string[] {
    return [
        ...responsiveClassNames(style.display, DISPLAY_CLASSES),
        ...responsiveClassNames(style.width, WIDTH_CLASSES),
        ...responsiveClassNames(style.maxWidth, MAX_WIDTH_CLASSES),
        ...responsiveClassNames(style.minHeight, MIN_HEIGHT_CLASSES),
        ...responsiveClassNames(style.padding, PADDING_CLASSES),
        ...responsiveClassNames(style.surface, SURFACE_CLASSES),
        ...responsiveClassNames(style.border, BORDER_CLASSES),
        ...responsiveClassNames(style.radius, RADIUS_CLASSES),
        ...responsiveClassNames(style.visibility, VISIBILITY_CLASSES)
    ];
}

function responsiveOverrideClassNames<T extends string>(
    value: Responsive<T>,
    defaultValue: T,
    classMap: ClassMap<T>
): readonly string[] {
    const classes = value.base === defaultValue ? [] : [...classMap[value.base]];

    if (value.md !== undefined) {
        classes.push(...classMap[value.md].map((className) => `md:${className}`));
    }

    if (value.lg !== undefined) {
        classes.push(...classMap[value.lg].map((className) => `lg:${className}`));
    }

    return classes;
}

function authoredNodeStyleClassNames(node: Exclude<DesignNode, { kind: 'layout' }>): string[] {
    return [
        ...responsiveOverrideClassNames(node.style.display, 'block', DISPLAY_CLASSES),
        ...responsiveOverrideClassNames(node.style.width, 'auto', WIDTH_CLASSES),
        ...responsiveOverrideClassNames(node.style.maxWidth, 'none', MAX_WIDTH_CLASSES),
        ...responsiveOverrideClassNames(node.style.minHeight, 'none', MIN_HEIGHT_CLASSES),
        ...responsiveOverrideClassNames(node.style.padding, '0', PADDING_CLASSES),
        ...responsiveOverrideClassNames(node.style.surface, 'transparent', SURFACE_CLASSES),
        ...responsiveOverrideClassNames(node.style.border, 'none', BORDER_CLASSES),
        ...responsiveOverrideClassNames(node.style.radius, 'none', RADIUS_CLASSES),
        ...responsiveOverrideClassNames(node.style.visibility, 'visible', VISIBILITY_CLASSES)
    ];
}

export function layoutStyleClassNames(style: LayoutStyle): readonly string[] {
    return [
        ...responsiveClassNames(style.direction, DIRECTION_CLASSES),
        ...responsiveClassNames(style.columns, COLUMNS_CLASSES),
        ...responsiveClassNames(style.gap, GAP_CLASSES),
        ...responsiveClassNames(style.align, ALIGN_CLASSES),
        ...responsiveClassNames(style.justify, JUSTIFY_CLASSES),
        ...responsiveClassNames(style.wrap, WRAP_CLASSES)
    ];
}

export function typographyClassNames(style: TypographyStyle): readonly string[] {
    return [
        ...responsiveClassNames(style.size, TEXT_SIZE_CLASSES),
        ...responsiveClassNames(style.weight, TEXT_WEIGHT_CLASSES),
        ...responsiveClassNames(style.align, TEXT_ALIGN_CLASSES),
        ...responsiveClassNames(style.tone, TEXT_TONE_CLASSES),
        ...responsiveClassNames(style.leading, LINE_HEIGHT_CLASSES)
    ];
}

export function nodeClassNames(node: DesignNode): readonly string[] {
    const classes =
        node.kind === 'layout'
            ? [...commonStyleClassNames(node.style)]
            : authoredNodeStyleClassNames(node);

    if (node.kind === 'layout') {
        classes.push(...layoutStyleClassNames(node.layoutStyle));
        if (node.style.maxWidth.base !== 'none') {
            classes.push('mx-auto');
        }
    } else if (node.kind === 'text') {
        classes.push(...typographyClassNames(node.typography));
    }

    return classes;
}

export const RESPONSIVE_CLASS_SAFELIST = `
md:block lg:block md:flex lg:flex md:grid lg:grid md:w-auto lg:w-auto md:w-full lg:w-full
md:w-fit lg:w-fit md:max-w-none lg:max-w-none md:max-w-sm lg:max-w-sm md:max-w-md lg:max-w-md
md:max-w-lg lg:max-w-lg md:max-w-xl lg:max-w-xl md:max-w-2xl lg:max-w-2xl
md:max-w-screen-2xl lg:max-w-screen-2xl md:min-h-0 lg:min-h-0 md:min-h-screen lg:min-h-screen
md:p-0 lg:p-0 md:p-1 lg:p-1 md:p-2 lg:p-2 md:p-3 lg:p-3 md:p-4 lg:p-4 md:p-6 lg:p-6
md:p-8 lg:p-8 md:p-12 lg:p-12 md:bg-transparent lg:bg-transparent md:bg-background
lg:bg-background md:bg-card lg:bg-card md:bg-secondary lg:bg-secondary md:bg-primary lg:bg-primary
md:border-0 lg:border-0 md:border lg:border md:border-border lg:border-border
md:border-border-strong lg:border-border-strong md:rounded-none lg:rounded-none md:rounded-sm
lg:rounded-sm md:rounded-md lg:rounded-md md:rounded-lg lg:rounded-lg md:rounded-xl lg:rounded-xl
md:rounded-full lg:rounded-full md:visible lg:visible md:invisible lg:invisible md:flex-row
lg:flex-row md:flex-col lg:flex-col md:grid-cols-1 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-2
md:grid-cols-3 lg:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 md:grid-cols-6 lg:grid-cols-6
md:grid-cols-12 lg:grid-cols-12 md:gap-0 lg:gap-0 md:gap-1 lg:gap-1 md:gap-2 lg:gap-2
md:gap-3 lg:gap-3 md:gap-4 lg:gap-4 md:gap-6 lg:gap-6 md:gap-8 lg:gap-8 md:gap-12 lg:gap-12
md:items-start lg:items-start md:items-center lg:items-center md:items-end lg:items-end
md:items-stretch lg:items-stretch md:justify-start lg:justify-start md:justify-center
lg:justify-center md:justify-end lg:justify-end md:justify-between lg:justify-between
md:flex-nowrap lg:flex-nowrap md:flex-wrap lg:flex-wrap md:text-xs lg:text-xs md:text-sm lg:text-sm
md:text-base lg:text-base md:text-lg lg:text-lg md:text-xl lg:text-xl md:text-2xl lg:text-2xl
md:text-3xl lg:text-3xl md:font-normal lg:font-normal md:font-medium lg:font-medium
md:font-semibold lg:font-semibold md:font-bold lg:font-bold md:text-left lg:text-left
md:text-center lg:text-center md:text-right lg:text-right md:text-foreground lg:text-foreground
md:text-foreground-muted lg:text-foreground-muted md:text-foreground-subtle
lg:text-foreground-subtle md:text-primary lg:text-primary md:text-success lg:text-success
md:text-warning lg:text-warning md:text-error lg:text-error md:leading-tight lg:leading-tight
md:leading-normal lg:leading-normal md:leading-relaxed lg:leading-relaxed
`;

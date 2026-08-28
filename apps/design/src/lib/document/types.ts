import type { Theme } from '@sivir-ui/svelte/themes/theme';
import type { CatalogFamily } from '../catalog/types';

export const DESIGN_DOCUMENT_FORMAT = 'sivir-design/document' as const;
export const DESIGN_DOCUMENT_SCHEMA_VERSION = 1 as const;

export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = readonly JsonValue[];
export type JsonObject = {
    readonly [key: string]: JsonValue;
};
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

export type Breakpoint = 'base' | 'md' | 'lg';

export type Responsive<T> = {
    readonly base: T;
    readonly md?: T;
    readonly lg?: T;
};

export type DisplayValue = 'block' | 'flex' | 'grid';
export type WidthValue = 'auto' | 'full' | 'fit';
export type MaxWidthValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'screen';
export type MinHeightValue = 'none' | 'screen';
export type SpaceValue = '0' | '1' | '2' | '3' | '4' | '6' | '8' | '12';
export type SurfaceValue = 'transparent' | 'background' | 'card' | 'muted' | 'primary';
export type BorderValue = 'none' | 'default' | 'strong';
export type RadiusValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type VisibilityValue = 'visible' | 'hidden';

export type CommonStyle = {
    readonly display: Responsive<DisplayValue>;
    readonly width: Responsive<WidthValue>;
    readonly maxWidth: Responsive<MaxWidthValue>;
    readonly minHeight: Responsive<MinHeightValue>;
    readonly padding: Responsive<SpaceValue>;
    readonly surface: Responsive<SurfaceValue>;
    readonly border: Responsive<BorderValue>;
    readonly radius: Responsive<RadiusValue>;
    readonly visibility: Responsive<VisibilityValue>;
};

export type DirectionValue = 'row' | 'column';
export type ColumnsValue = '1' | '2' | '3' | '4' | '6' | '12';
export type AlignValue = 'start' | 'center' | 'end' | 'stretch';
export type JustifyValue = 'start' | 'center' | 'end' | 'between';
export type WrapValue = 'nowrap' | 'wrap';

export type LayoutStyle = {
    readonly direction: Responsive<DirectionValue>;
    readonly columns: Responsive<ColumnsValue>;
    readonly gap: Responsive<SpaceValue>;
    readonly align: Responsive<AlignValue>;
    readonly justify: Responsive<JustifyValue>;
    readonly wrap: Responsive<WrapValue>;
};

export type TextSizeValue = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
export type TextWeightValue = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextAlignValue = 'left' | 'center' | 'right';
export type TextToneValue =
    | 'default'
    | 'muted'
    | 'subtle'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger';
export type LineHeightValue = 'tight' | 'normal' | 'relaxed';

export type TypographyStyle = {
    readonly size: Responsive<TextSizeValue>;
    readonly weight: Responsive<TextWeightValue>;
    readonly align: Responsive<TextAlignValue>;
    readonly tone: Responsive<TextToneValue>;
    readonly leading: Responsive<LineHeightValue>;
};

export type LayoutKind =
    | 'page'
    | 'section'
    | 'header'
    | 'main'
    | 'navigation'
    | 'aside'
    | 'footer'
    | 'container'
    | 'stack'
    | 'row'
    | 'grid';

export type TextKind = 'heading' | 'paragraph' | 'label' | 'span';

export type LayoutNode = {
    readonly id: string;
    readonly kind: 'layout';
    readonly layout: LayoutKind;
    readonly label?: string;
    readonly children: readonly string[];
    readonly style: CommonStyle;
    readonly layoutStyle: LayoutStyle;
};

export type TextNode = {
    readonly id: string;
    readonly kind: 'text';
    readonly textKind: TextKind;
    readonly text: string;
    readonly headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    readonly htmlFor?: string;
    readonly style: CommonStyle;
    readonly typography: TypographyStyle;
};

export type ComponentNode = {
    readonly id: string;
    readonly kind: 'component';
    readonly family: CatalogFamily;
    readonly template: string;
    readonly adapterId: string;
    readonly adapterVersion: number;
    readonly props: JsonObject;
    readonly slots: Readonly<Record<string, readonly string[]>>;
    readonly style: CommonStyle;
};

export type DesignNode = LayoutNode | TextNode | ComponentNode;

export type DesignPage = {
    readonly id: string;
    readonly name: string;
    readonly route: string;
    readonly rootNodeId: string;
};

export type DesignDocument = {
    readonly format: typeof DESIGN_DOCUMENT_FORMAT;
    readonly schemaVersion: typeof DESIGN_DOCUMENT_SCHEMA_VERSION;
    readonly id: string;
    readonly name: string;
    readonly compatibility: {
        readonly catalogVersion: string;
        readonly sivirPackageVersion: string;
        readonly generatorVersion: string;
    };
    readonly appearance: {
        readonly theme: Theme;
        readonly colorMode: 'light' | 'dark';
    };
    readonly pages: readonly DesignPage[];
    readonly nodes: Readonly<Record<string, DesignNode>>;
};

export type ParentReference = {
    readonly parentId: string;
    readonly slot: string | null;
    readonly index: number;
};

export const CATALOG_FAMILIES = [
    'alert',
    'avatar',
    'badge',
    'button',
    'card',
    'checkbox',
    'input',
    'label',
    'progress',
    'skeleton',
    'switch',
    'textarea'
] as const;

export type CatalogFamily = (typeof CATALOG_FAMILIES)[number];
export type CatalogGroup = 'content' | 'forms' | 'feedback';
export type CatalogPropValue = string | number | boolean | null;

type BasePropSchema = {
    readonly name: string;
    readonly target: string;
    readonly label: string;
    readonly required: boolean;
};

export type StringPropSchema = BasePropSchema & {
    readonly kind: 'string';
    readonly format: 'text' | 'url' | 'id';
    readonly minLength: number;
    readonly maxLength: number;
    readonly defaultValue?: string;
};

export type EnumPropSchema = BasePropSchema & {
    readonly kind: 'enum';
    readonly values: readonly string[];
    readonly defaultValue: string;
};

export type BooleanPropSchema = BasePropSchema & {
    readonly kind: 'boolean';
    readonly defaultValue: boolean;
};

export type NumberPropSchema = BasePropSchema & {
    readonly kind: 'number';
    readonly min: number;
    readonly max: number;
    readonly step: number;
    readonly integer: boolean;
    readonly defaultValue?: number;
};

export type CatalogPropSchema =
    | StringPropSchema
    | EnumPropSchema
    | BooleanPropSchema
    | NumberPropSchema;

export type CatalogPart = {
    readonly id: string;
    readonly symbol: string;
    readonly required: boolean;
};

export type CatalogSlot = {
    readonly id: string;
    readonly label: string;
    readonly minChildren: number;
    readonly maxChildren: number;
    readonly allowedNodeKinds: readonly ('layout' | 'text' | 'component')[];
    readonly partPath: readonly string[];
};

export type CatalogDefinition = {
    readonly family: CatalogFamily;
    readonly label: string;
    readonly description: string;
    readonly group: CatalogGroup;
    readonly status: 'supported' | 'experimental';
    readonly authoring: {
        readonly allowedParentKinds: readonly ('layout' | 'component')[];
        readonly selection: 'root';
        readonly resize: 'none' | 'width' | 'both';
        readonly interaction: 'none' | 'native' | 'controlled' | 'collection';
        readonly portal: 'none' | 'body';
    };
    readonly packageImport: {
        readonly source: '@sivir-ui/svelte';
        readonly symbol: string;
        readonly style: 'named' | 'namespace';
    };
    readonly adapter: {
        readonly id: string;
        readonly version: number;
        readonly previewId: string;
        readonly codegenId: string;
        readonly migrations: readonly {
            readonly id: string;
            readonly fromVersion: number;
            readonly toVersion: number;
        }[];
    };
    readonly templates: readonly {
        readonly id: string;
        readonly label: string;
    }[];
    readonly parts: readonly CatalogPart[];
    readonly props: readonly CatalogPropSchema[];
    readonly slots: readonly CatalogSlot[];
};

export type CatalogValidationIssue = {
    readonly path: string;
    readonly message: string;
};

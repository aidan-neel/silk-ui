import { parseTheme } from '@sivir-ui/svelte/themes/theme';
import { findCatalogDefinition } from '../catalog/catalog';
import { validateComponentProps } from '../catalog/props';
import type { CatalogDefinition } from '../catalog/types';
import {
    DESIGN_DOCUMENT_FORMAT,
    DESIGN_DOCUMENT_SCHEMA_VERSION,
    type DesignDocument,
    type DesignNode,
    type ParentReference
} from './types';

export const DOCUMENT_LIMITS = {
    maxPages: 100,
    maxNodes: 5000,
    maxDepth: 100,
    maxStringLength: 100_000,
    maxTotalTextLength: 2_000_000
} as const;

const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const BREAKPOINT_KEYS = ['base', 'md', 'lg'] as const;
const COMMON_STYLE_VALUES = {
    display: ['block', 'flex', 'grid'],
    width: ['auto', 'full', 'fit'],
    maxWidth: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'screen'],
    minHeight: ['none', 'screen'],
    padding: ['0', '1', '2', '3', '4', '6', '8', '12'],
    surface: ['transparent', 'background', 'card', 'muted', 'primary'],
    border: ['none', 'default', 'strong'],
    radius: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    visibility: ['visible', 'hidden']
} as const;
const LAYOUT_STYLE_VALUES = {
    direction: ['row', 'column'],
    columns: ['1', '2', '3', '4', '6', '12'],
    gap: ['0', '1', '2', '3', '4', '6', '8', '12'],
    align: ['start', 'center', 'end', 'stretch'],
    justify: ['start', 'center', 'end', 'between'],
    wrap: ['nowrap', 'wrap']
} as const;
const TYPOGRAPHY_VALUES = {
    size: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'],
    weight: ['normal', 'medium', 'semibold', 'bold'],
    align: ['left', 'center', 'right'],
    tone: ['default', 'muted', 'subtle', 'primary', 'success', 'warning', 'danger'],
    leading: ['tight', 'normal', 'relaxed']
} as const;
const LAYOUT_KINDS = [
    'page',
    'section',
    'header',
    'main',
    'navigation',
    'aside',
    'footer',
    'container',
    'stack',
    'row',
    'grid'
] as const;
const TEXT_KINDS = ['heading', 'paragraph', 'label', 'span'] as const;
const ROOT_KEYS = [
    'format',
    'schemaVersion',
    'id',
    'name',
    'compatibility',
    'appearance',
    'pages',
    'nodes'
] as const;
const COMMON_NODE_KEYS = ['id', 'kind', 'style'] as const;

export type DocumentValidationIssue = {
    readonly path: string;
    readonly code: string;
    readonly message: string;
};

export class DesignDocumentValidationError extends TypeError {
    readonly issues: readonly DocumentValidationIssue[];

    constructor(issues: readonly DocumentValidationIssue[]) {
        super(`Invalid Sivir Design document: ${issues[0]?.message ?? 'unknown validation error'}`);
        this.name = 'DesignDocumentValidationError';
        this.issues = issues;
    }
}

type ValidationContext = {
    readonly issues: DocumentValidationIssue[];
    totalTextLength: number;
};

function addIssue(context: ValidationContext, path: string, code: string, message: string): void {
    context.issues.push({ path, code, message });
}

function isRecord(value: unknown): value is Record<string, unknown> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}

function validateJsonValue(
    value: unknown,
    path: string,
    context: ValidationContext,
    ancestors: ReadonlySet<object>
): void {
    if (value === null || typeof value === 'boolean') {
        return;
    }

    if (typeof value === 'number') {
        if (!Number.isFinite(value)) {
            addIssue(context, path, 'json.number', 'JSON numbers must be finite.');
        }
        return;
    }

    if (typeof value === 'string') {
        if (value.length > DOCUMENT_LIMITS.maxStringLength) {
            addIssue(
                context,
                path,
                'json.string-length',
                `Strings must not exceed ${DOCUMENT_LIMITS.maxStringLength} characters.`
            );
        }

        context.totalTextLength += value.length;
        return;
    }

    if (typeof value !== 'object' || value === null) {
        addIssue(context, path, 'json.type', 'Values must use the closed JSON data model.');
        return;
    }

    if (ancestors.has(value)) {
        addIssue(context, path, 'json.cycle', 'JSON values must not contain reference cycles.');
        return;
    }

    const nextAncestors = new Set(ancestors);
    nextAncestors.add(value);

    if (Array.isArray(value)) {
        for (const [index, item] of value.entries()) {
            validateJsonValue(item, `${path}[${index}]`, context, nextAncestors);
        }
        return;
    }

    if (!isRecord(value)) {
        addIssue(context, path, 'json.object', 'JSON objects must have a plain prototype.');
        return;
    }

    if (Object.getOwnPropertySymbols(value).length > 0) {
        addIssue(context, path, 'json.symbol-key', 'JSON objects must not contain symbol keys.');
    }

    for (const key of Object.keys(value)) {
        if (FORBIDDEN_KEYS.has(key)) {
            addIssue(
                context,
                `${path}.${key}`,
                'json.forbidden-key',
                'This object key is forbidden.'
            );
            continue;
        }

        const descriptor = Object.getOwnPropertyDescriptor(value, key);

        if (!descriptor || !Object.hasOwn(descriptor, 'value')) {
            addIssue(
                context,
                `${path}.${key}`,
                'json.accessor',
                'JSON objects must contain data properties only.'
            );
            continue;
        }

        validateJsonValue(descriptor.value, `${path}.${key}`, context, nextAncestors);
    }
}

function requireRecord(
    value: unknown,
    path: string,
    context: ValidationContext
): Record<string, unknown> | undefined {
    if (!isRecord(value)) {
        addIssue(context, path, 'type.object', 'Expected an object.');
        return undefined;
    }

    return value;
}

function requireArray(
    value: unknown,
    path: string,
    context: ValidationContext
): readonly unknown[] | undefined {
    if (!Array.isArray(value)) {
        addIssue(context, path, 'type.array', 'Expected an array.');
        return undefined;
    }

    return value;
}

function validateExactKeys(
    value: Record<string, unknown>,
    required: readonly string[],
    optional: readonly string[],
    path: string,
    context: ValidationContext
): void {
    const allowed = new Set([...required, ...optional]);

    for (const key of Object.keys(value)) {
        if (!allowed.has(key)) {
            addIssue(context, `${path}.${key}`, 'object.unknown-key', 'Unknown field.');
        }
    }

    for (const key of required) {
        if (!Object.hasOwn(value, key)) {
            addIssue(
                context,
                `${path}.${key}`,
                'object.required-key',
                'Required field is missing.'
            );
        }
    }
}

function validateString(
    value: unknown,
    path: string,
    context: ValidationContext,
    options: {
        readonly allowEmpty?: boolean;
        readonly maxLength?: number;
    } = {}
): value is string {
    if (typeof value !== 'string') {
        addIssue(context, path, 'type.string', 'Expected a string.');
        return false;
    }

    if (!options.allowEmpty && value.trim() === '') {
        addIssue(context, path, 'string.empty', 'Expected a non-empty string.');
        return false;
    }

    if (options.maxLength !== undefined && value.length > options.maxLength) {
        addIssue(
            context,
            path,
            'string.length',
            `String must not exceed ${options.maxLength} characters.`
        );
        return false;
    }

    return true;
}

function validateId(value: unknown, path: string, context: ValidationContext): value is string {
    if (!validateString(value, path, context, { maxLength: 128 })) {
        return false;
    }

    if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(value)) {
        addIssue(
            context,
            path,
            'id.format',
            'IDs may contain letters, numbers, periods, underscores, colons, and hyphens.'
        );
        return false;
    }

    return true;
}

function validateEnum(
    value: unknown,
    values: readonly string[],
    path: string,
    context: ValidationContext
): value is string {
    if (typeof value !== 'string' || !values.includes(value)) {
        addIssue(context, path, 'enum.value', `Expected one of: ${values.join(', ')}.`);
        return false;
    }

    return true;
}

function validateResponsive(
    value: unknown,
    allowedValues: readonly string[],
    path: string,
    context: ValidationContext
): void {
    const responsive = requireRecord(value, path, context);

    if (!responsive) {
        return;
    }

    validateExactKeys(responsive, ['base'], ['md', 'lg'], path, context);

    for (const breakpoint of BREAKPOINT_KEYS) {
        if (Object.hasOwn(responsive, breakpoint)) {
            validateEnum(responsive[breakpoint], allowedValues, `${path}.${breakpoint}`, context);
        }
    }
}

function validateResponsiveGroup(
    value: unknown,
    definitions: Readonly<Record<string, readonly string[]>>,
    path: string,
    context: ValidationContext
): void {
    const group = requireRecord(value, path, context);

    if (!group) {
        return;
    }

    const keys = Object.keys(definitions);
    validateExactKeys(group, keys, [], path, context);

    for (const key of keys) {
        validateResponsive(group[key], definitions[key], `${path}.${key}`, context);
    }
}

function validateTheme(value: unknown, path: string, context: ValidationContext): void {
    const theme = requireRecord(value, path, context);

    if (!theme) {
        return;
    }

    validateExactKeys(
        theme,
        [
            'version',
            'slug',
            'name',
            'description',
            'brand',
            'neutral',
            'radius',
            'density',
            'motion',
            'fontSans',
            'fontMono',
            'fontHeader'
        ],
        ['publisher'],
        path,
        context
    );

    try {
        parseTheme(theme);
    } catch (error) {
        addIssue(
            context,
            path,
            'theme.invalid',
            error instanceof Error ? error.message : 'Theme is invalid.'
        );
    }

    if (typeof theme.brand === 'string' && !/^#[0-9a-f]{6}$/.test(theme.brand)) {
        addIssue(
            context,
            `${path}.brand`,
            'theme.brand',
            'Theme brand colors must use lowercase six-digit hex.'
        );
    }

    for (const field of ['fontSans', 'fontMono', 'fontHeader'] as const) {
        const font = theme[field];

        if (typeof font !== 'string') {
            continue;
        }

        const unsafe =
            font.length > 500 ||
            /[;{}@\\]/.test(font) ||
            font.includes('/*') ||
            font.includes('*/') ||
            /url\s*\(/i.test(font) ||
            [...font].some((character) => {
                const code = character.charCodeAt(0);
                return code < 32 || code === 127;
            });

        if (unsafe) {
            addIssue(
                context,
                `${path}.${field}`,
                'theme.unsafe-font',
                'Theme font values contain unsafe CSS syntax.'
            );
        }
    }
}

function validateCompatibility(value: unknown, path: string, context: ValidationContext): void {
    const compatibility = requireRecord(value, path, context);

    if (!compatibility) {
        return;
    }

    validateExactKeys(
        compatibility,
        ['catalogVersion', 'sivirPackageVersion', 'generatorVersion'],
        [],
        path,
        context
    );

    for (const field of ['catalogVersion', 'sivirPackageVersion', 'generatorVersion'] as const) {
        validateString(compatibility[field], `${path}.${field}`, context, { maxLength: 64 });
    }
}

function validateAppearance(value: unknown, path: string, context: ValidationContext): void {
    const appearance = requireRecord(value, path, context);

    if (!appearance) {
        return;
    }

    validateExactKeys(appearance, ['theme', 'colorMode'], [], path, context);
    validateTheme(appearance.theme, `${path}.theme`, context);
    validateEnum(appearance.colorMode, ['light', 'dark'], `${path}.colorMode`, context);
}

function validatePage(
    value: unknown,
    index: number,
    pageIds: Set<string>,
    rootIds: Set<string>,
    context: ValidationContext
): void {
    const path = `$.pages[${index}]`;
    const page = requireRecord(value, path, context);

    if (!page) {
        return;
    }

    validateExactKeys(page, ['id', 'name', 'route', 'rootNodeId'], [], path, context);

    if (validateId(page.id, `${path}.id`, context)) {
        if (pageIds.has(page.id)) {
            addIssue(context, `${path}.id`, 'page.duplicate-id', 'Page IDs must be unique.');
        }
        pageIds.add(page.id);
    }

    validateString(page.name, `${path}.name`, context, { maxLength: 200 });

    if (validateString(page.route, `${path}.route`, context, { maxLength: 500 })) {
        const routeIsSafe =
            page.route === '/' ||
            (/^\/(?:[a-z0-9-]+\/)*[a-z0-9-]+$/.test(page.route) && !page.route.includes('..'));

        if (!routeIsSafe) {
            addIssue(
                context,
                `${path}.route`,
                'page.route',
                'Routes must be lowercase absolute paths without traversal segments.'
            );
        }
    }

    if (validateId(page.rootNodeId, `${path}.rootNodeId`, context)) {
        if (rootIds.has(page.rootNodeId)) {
            addIssue(
                context,
                `${path}.rootNodeId`,
                'page.shared-root',
                'Each page must have a distinct root node.'
            );
        }
        rootIds.add(page.rootNodeId);
    }
}

function validateNodeIdList(
    value: unknown,
    path: string,
    context: ValidationContext
): readonly string[] {
    const values = requireArray(value, path, context);

    if (!values) {
        return [];
    }

    const ids: string[] = [];
    const seen = new Set<string>();

    for (const [index, item] of values.entries()) {
        if (!validateId(item, `${path}[${index}]`, context)) {
            continue;
        }

        if (seen.has(item)) {
            addIssue(
                context,
                `${path}[${index}]`,
                'node.duplicate-child',
                'A child may appear only once in a parent.'
            );
        }

        seen.add(item);
        ids.push(item);
    }

    return ids;
}

function validateLayoutNode(
    node: Record<string, unknown>,
    path: string,
    context: ValidationContext
): void {
    validateExactKeys(
        node,
        [...COMMON_NODE_KEYS, 'layout', 'children', 'layoutStyle'],
        ['label'],
        path,
        context
    );
    validateEnum(node.layout, LAYOUT_KINDS, `${path}.layout`, context);
    validateNodeIdList(node.children, `${path}.children`, context);
    validateResponsiveGroup(node.layoutStyle, LAYOUT_STYLE_VALUES, `${path}.layoutStyle`, context);

    if (Object.hasOwn(node, 'label')) {
        validateString(node.label, `${path}.label`, context, { maxLength: 500 });
    }
}

function validateTextNode(
    node: Record<string, unknown>,
    path: string,
    context: ValidationContext
): void {
    validateExactKeys(
        node,
        [...COMMON_NODE_KEYS, 'textKind', 'text', 'typography'],
        ['headingLevel', 'htmlFor'],
        path,
        context
    );
    validateEnum(node.textKind, TEXT_KINDS, `${path}.textKind`, context);
    validateString(node.text, `${path}.text`, context, {
        allowEmpty: true,
        maxLength: DOCUMENT_LIMITS.maxStringLength
    });
    validateResponsiveGroup(node.typography, TYPOGRAPHY_VALUES, `${path}.typography`, context);

    if (node.textKind === 'heading') {
        if (
            typeof node.headingLevel !== 'number' ||
            !Number.isInteger(node.headingLevel) ||
            node.headingLevel < 1 ||
            node.headingLevel > 6
        ) {
            addIssue(
                context,
                `${path}.headingLevel`,
                'text.heading-level',
                'Heading text requires a level from 1 through 6.'
            );
        }
    } else if (Object.hasOwn(node, 'headingLevel')) {
        addIssue(
            context,
            `${path}.headingLevel`,
            'text.heading-level',
            'Only heading text may define a heading level.'
        );
    }

    if (Object.hasOwn(node, 'htmlFor')) {
        validateId(node.htmlFor, `${path}.htmlFor`, context);

        if (node.textKind !== 'label') {
            addIssue(
                context,
                `${path}.htmlFor`,
                'text.html-for',
                'Only label text may reference a control ID.'
            );
        }
    }
}

function validateComponentSlots(
    node: Record<string, unknown>,
    definition: CatalogDefinition,
    path: string,
    context: ValidationContext
): void {
    const slots = requireRecord(node.slots, `${path}.slots`, context);

    if (!slots) {
        return;
    }

    const definitions = new Map(definition.slots.map((slot) => [slot.id, slot]));

    for (const key of Object.keys(slots)) {
        if (!definitions.has(key)) {
            addIssue(context, `${path}.slots.${key}`, 'component.slot', 'Unknown component slot.');
        }
    }

    for (const slot of definition.slots) {
        const slotPath = `${path}.slots.${slot.id}`;
        const children = Object.hasOwn(slots, slot.id)
            ? validateNodeIdList(slots[slot.id], slotPath, context)
            : [];

        if (children.length < slot.minChildren || children.length > slot.maxChildren) {
            addIssue(
                context,
                slotPath,
                'component.slot-cardinality',
                `Slot requires between ${slot.minChildren} and ${slot.maxChildren} children.`
            );
        }
    }
}

function validateComponentNode(
    node: Record<string, unknown>,
    path: string,
    context: ValidationContext
): void {
    validateExactKeys(
        node,
        [
            ...COMMON_NODE_KEYS,
            'family',
            'template',
            'adapterId',
            'adapterVersion',
            'props',
            'slots'
        ],
        [],
        path,
        context
    );

    if (typeof node.family !== 'string') {
        addIssue(context, `${path}.family`, 'component.family', 'Expected a component family.');
        return;
    }

    const definition = findCatalogDefinition(node.family);

    if (!definition) {
        addIssue(context, `${path}.family`, 'component.family', 'Unknown component family.');
        return;
    }

    if (
        typeof node.template !== 'string' ||
        !definition.templates.some((template) => template.id === node.template)
    ) {
        addIssue(context, `${path}.template`, 'component.template', 'Unknown component template.');
    }

    if (node.adapterId !== definition.adapter.id) {
        addIssue(
            context,
            `${path}.adapterId`,
            'component.adapter-id',
            `Expected adapter ${definition.adapter.id}.`
        );
    }

    if (node.adapterVersion !== definition.adapter.version) {
        addIssue(
            context,
            `${path}.adapterVersion`,
            'component.adapter-version',
            `Expected adapter version ${definition.adapter.version}.`
        );
    }

    for (const issue of validateComponentProps(definition, node.props, `${path}.props`)) {
        addIssue(context, issue.path, 'component.prop', issue.message);
    }

    validateComponentSlots(node, definition, path, context);
}

function validateNode(
    key: string,
    value: unknown,
    context: ValidationContext
): Record<string, unknown> | undefined {
    const path = `$.nodes.${key}`;
    const node = requireRecord(value, path, context);

    if (!node) {
        return undefined;
    }

    if (validateId(node.id, `${path}.id`, context) && node.id !== key) {
        addIssue(context, `${path}.id`, 'node.id-mismatch', 'Node ID must match its record key.');
    }

    validateResponsiveGroup(node.style, COMMON_STYLE_VALUES, `${path}.style`, context);

    switch (node.kind) {
        case 'layout':
            validateLayoutNode(node, path, context);
            break;
        case 'text':
            validateTextNode(node, path, context);
            break;
        case 'component':
            validateComponentNode(node, path, context);
            break;
        default:
            addIssue(context, `${path}.kind`, 'node.kind', 'Unknown node kind.');
    }

    return node;
}

function childEdges(node: Record<string, unknown>): readonly { id: string; slot: string | null }[] {
    if (node.kind === 'layout' && Array.isArray(node.children)) {
        return node.children
            .filter((value): value is string => typeof value === 'string')
            .map((id) => ({ id, slot: null }));
    }

    if (node.kind !== 'component' || !isRecord(node.slots)) {
        return [];
    }

    const edges: { id: string; slot: string }[] = [];

    for (const slot of Object.keys(node.slots).sort()) {
        const children = node.slots[slot];

        if (!Array.isArray(children)) {
            continue;
        }

        for (const child of children) {
            if (typeof child === 'string') {
                edges.push({ id: child, slot });
            }
        }
    }

    return edges;
}

function validateGraph(
    nodes: ReadonlyMap<string, Record<string, unknown>>,
    rootIds: ReadonlySet<string>,
    context: ValidationContext
): void {
    const parentCounts = new Map<string, number>();

    for (const [parentId, node] of nodes) {
        const definition =
            node.kind === 'component' && typeof node.family === 'string'
                ? findCatalogDefinition(node.family)
                : undefined;
        const slots = definition
            ? new Map(definition.slots.map((slot) => [slot.id, slot]))
            : undefined;

        for (const edge of childEdges(node)) {
            const child = nodes.get(edge.id);

            if (!child) {
                addIssue(
                    context,
                    `$.nodes.${parentId}`,
                    'node.missing-child',
                    `Child node ${edge.id} does not exist.`
                );
                continue;
            }

            parentCounts.set(edge.id, (parentCounts.get(edge.id) ?? 0) + 1);

            if (edge.slot) {
                const slot = slots?.get(edge.slot);
                const childKind = child.kind;

                if (
                    slot &&
                    (childKind === 'layout' || childKind === 'text' || childKind === 'component') &&
                    !slot.allowedNodeKinds.includes(childKind)
                ) {
                    addIssue(
                        context,
                        `$.nodes.${parentId}.slots.${edge.slot}`,
                        'component.slot-child',
                        `Node kind ${String(child.kind)} is not legal in this slot.`
                    );
                }
            }

            if (child.kind === 'component') {
                const childDefinition =
                    typeof child.family === 'string'
                        ? findCatalogDefinition(child.family)
                        : undefined;
                const parentKind = node.kind;

                if (
                    childDefinition &&
                    (parentKind === 'layout' || parentKind === 'component') &&
                    !childDefinition.authoring.allowedParentKinds.includes(parentKind)
                ) {
                    addIssue(
                        context,
                        `$.nodes.${parentId}`,
                        'component.parent',
                        `Component ${child.family} is not legal in this parent.`
                    );
                }
            }
        }
    }

    for (const id of nodes.keys()) {
        const count = parentCounts.get(id) ?? 0;

        if (rootIds.has(id)) {
            if (count !== 0) {
                addIssue(
                    context,
                    `$.nodes.${id}`,
                    'node.root-parent',
                    'Page roots must not have a parent.'
                );
            }
        } else if (count > 1) {
            addIssue(context, `$.nodes.${id}`, 'node.shared', 'Nodes may have only one parent.');
        }
    }

    for (const rootId of rootIds) {
        const root = nodes.get(rootId);

        if (!root) {
            addIssue(
                context,
                '$.pages',
                'page.missing-root',
                `Root node ${rootId} does not exist.`
            );
        } else if (root.kind !== 'layout' || root.layout !== 'page') {
            addIssue(
                context,
                `$.nodes.${rootId}`,
                'page.root-kind',
                'Page roots must be page layout nodes.'
            );
        }
    }

    const visited = new Set<string>();
    const visiting = new Set<string>();

    function visit(id: string, depth: number): void {
        if (depth > DOCUMENT_LIMITS.maxDepth) {
            addIssue(
                context,
                `$.nodes.${id}`,
                'node.depth',
                `Document depth must not exceed ${DOCUMENT_LIMITS.maxDepth}.`
            );
            return;
        }

        if (visiting.has(id)) {
            addIssue(
                context,
                `$.nodes.${id}`,
                'node.cycle',
                'Document nodes must not form cycles.'
            );
            return;
        }

        if (visited.has(id)) {
            return;
        }

        const node = nodes.get(id);

        if (!node) {
            return;
        }

        visiting.add(id);

        for (const edge of childEdges(node)) {
            visit(edge.id, depth + 1);
        }

        visiting.delete(id);
        visited.add(id);
    }

    for (const rootId of rootIds) {
        visit(rootId, 1);
    }

    const unreachableIds = [...nodes.keys()].filter((id) => !visited.has(id));

    for (const id of unreachableIds) {
        addIssue(
            context,
            `$.nodes.${id}`,
            'node.unreachable',
            'Node is not reachable from a page.'
        );
    }

    for (const id of unreachableIds) {
        visit(id, 1);
    }
}

function validateDocument(value: unknown): readonly DocumentValidationIssue[] {
    const context: ValidationContext = {
        issues: [],
        totalTextLength: 0
    };

    validateJsonValue(value, '$', context, new Set());

    if (context.totalTextLength > DOCUMENT_LIMITS.maxTotalTextLength) {
        addIssue(
            context,
            '$',
            'json.total-text',
            `Total text must not exceed ${DOCUMENT_LIMITS.maxTotalTextLength} characters.`
        );
    }

    const document = requireRecord(value, '$', context);

    if (!document) {
        return context.issues;
    }

    validateExactKeys(document, ROOT_KEYS, [], '$', context);

    if (document.format !== DESIGN_DOCUMENT_FORMAT) {
        addIssue(
            context,
            '$.format',
            'document.format',
            `Expected format ${DESIGN_DOCUMENT_FORMAT}.`
        );
    }

    if (document.schemaVersion !== DESIGN_DOCUMENT_SCHEMA_VERSION) {
        addIssue(
            context,
            '$.schemaVersion',
            'document.schema-version',
            `Expected schema version ${DESIGN_DOCUMENT_SCHEMA_VERSION}.`
        );
    }

    validateId(document.id, '$.id', context);
    validateString(document.name, '$.name', context, { maxLength: 200 });
    validateCompatibility(document.compatibility, '$.compatibility', context);
    validateAppearance(document.appearance, '$.appearance', context);

    const pageIds = new Set<string>();
    const rootIds = new Set<string>();
    const pages = requireArray(document.pages, '$.pages', context);

    if (pages) {
        if (pages.length === 0 || pages.length > DOCUMENT_LIMITS.maxPages) {
            addIssue(
                context,
                '$.pages',
                'document.page-count',
                `Documents require 1 to ${DOCUMENT_LIMITS.maxPages} pages.`
            );
        }

        for (const [index, page] of pages.entries()) {
            validatePage(page, index, pageIds, rootIds, context);
        }
    }

    const nodeRecord = requireRecord(document.nodes, '$.nodes', context);
    const nodes = new Map<string, Record<string, unknown>>();

    if (nodeRecord) {
        const entries = Object.entries(nodeRecord);

        if (entries.length === 0 || entries.length > DOCUMENT_LIMITS.maxNodes) {
            addIssue(
                context,
                '$.nodes',
                'document.node-count',
                `Documents require 1 to ${DOCUMENT_LIMITS.maxNodes} nodes.`
            );
        }

        for (const [key, nodeValue] of entries) {
            validateId(key, `$.nodes.${key}`, context);
            const node = validateNode(key, nodeValue, context);

            if (node) {
                nodes.set(key, node);
            }
        }
    }

    validateGraph(nodes, rootIds, context);
    return context.issues;
}

export function parseDesignDocument(value: unknown): DesignDocument {
    const issues = validateDocument(value);

    if (issues.length > 0) {
        throw new DesignDocumentValidationError(issues);
    }

    return structuredClone(value) as DesignDocument;
}

export function safeParseDesignDocument(
    value: unknown
):
    | { readonly success: true; readonly document: DesignDocument }
    | { readonly success: false; readonly issues: readonly DocumentValidationIssue[] } {
    try {
        return { success: true, document: parseDesignDocument(value) };
    } catch (error) {
        if (error instanceof DesignDocumentValidationError) {
            return { success: false, issues: error.issues };
        }

        throw error;
    }
}

export function deriveParentReferences(
    document: DesignDocument
): ReadonlyMap<string, ParentReference> {
    const parents = new Map<string, ParentReference>();

    for (const node of Object.values(document.nodes)) {
        if (node.kind === 'layout') {
            for (const [index, childId] of node.children.entries()) {
                parents.set(childId, { parentId: node.id, slot: null, index });
            }
        } else if (node.kind === 'component') {
            for (const slot of Object.keys(node.slots).sort()) {
                for (const [index, childId] of node.slots[slot].entries()) {
                    parents.set(childId, { parentId: node.id, slot, index });
                }
            }
        }
    }

    return parents;
}

export function cloneDesignNode(node: DesignNode): DesignNode {
    return structuredClone(node);
}

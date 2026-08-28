import { themeToCss } from '@sivir-ui/svelte/themes/theme';
import { CATALOG_VERSION, getCatalogDefinition } from '../catalog/catalog';
import { materializeComponentProps } from '../catalog/props';
import type { CatalogDefinition, CatalogFamily } from '../catalog/types';
import { stableStringify } from '../document/portable';
import { parseDesignDocument } from '../document/schema';
import type {
    ComponentNode,
    DesignDocument,
    DesignNode,
    DesignPage,
    JsonValue,
    LayoutNode,
    TextNode
} from '../document/types';
import { nodeClassNames } from '../layout/classes';

export const GENERATOR_VERSION = '1.0.0' as const;
export const EXPORT_MANIFEST_FORMAT = 'sivir-design/export-manifest' as const;

export type GeneratedFile = {
    readonly path: string;
    readonly content: string;
};

export type GeneratedProject = {
    readonly generatorVersion: typeof GENERATOR_VERSION;
    readonly catalogVersion: typeof CATALOG_VERSION;
    readonly files: readonly GeneratedFile[];
};

export type GenerateOptions = {
    readonly includeTheme?: boolean;
};

export class CodeGenerationError extends Error {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = 'CodeGenerationError';
        this.code = code;
    }
}

function indent(level: number): string {
    return ' '.repeat(level * 4);
}

function compareStrings(left: string, right: string): number {
    if (left < right) {
        return -1;
    }

    if (left > right) {
        return 1;
    }

    return 0;
}

function escapeAttribute(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('{', '&#123;')
        .replaceAll('}', '&#125;');
}

function escapeText(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('{', '&#123;')
        .replaceAll('}', '&#125;');
}

function attribute(name: string, value: JsonValue): string {
    if (typeof value === 'string') {
        return `${name}="${escapeAttribute(value)}"`;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return `${name}={${String(value)}}`;
    }

    throw new CodeGenerationError(
        'prop.unsupported',
        `Adapter prop ${name} contains a value that cannot be emitted safely.`
    );
}

function classAttribute(node: DesignNode): string {
    return `class="${nodeClassNames(node).join(' ')}"`;
}

function componentAttributes(node: ComponentNode, names?: ReadonlySet<string>): readonly string[] {
    const definition = getCatalogDefinition(node.family);
    const props = materializeComponentProps(node.family, node.props);
    const attributes: string[] = [];

    for (const schema of definition.props) {
        if (names && !names.has(schema.name)) {
            continue;
        }

        if (Object.hasOwn(props, schema.name)) {
            attributes.push(attribute(schema.target, props[schema.name]));
        }
    }

    return attributes;
}

function openingTag(tag: string, attributes: readonly string[]): string {
    return attributes.length > 0 ? `<${tag} ${attributes.join(' ')}>` : `<${tag}>`;
}

function selfClosingTag(tag: string, attributes: readonly string[]): string {
    return attributes.length > 0 ? `<${tag} ${attributes.join(' ')} />` : `<${tag} />`;
}

function layoutTag(node: LayoutNode): string {
    switch (node.layout) {
        case 'section':
            return 'section';
        case 'header':
            return 'header';
        case 'main':
            return 'main';
        case 'navigation':
            return 'nav';
        case 'aside':
            return 'aside';
        case 'footer':
            return 'footer';
        default:
            return 'div';
    }
}

function textTag(node: TextNode): string {
    switch (node.textKind) {
        case 'heading':
            return `h${node.headingLevel ?? 2}`;
        case 'paragraph':
            return 'p';
        case 'label':
            return 'label';
        case 'span':
            return 'span';
    }
}

function renderTextNode(node: TextNode, level: number): readonly string[] {
    const tag = textTag(node);
    const attributes = [classAttribute(node)];

    if (node.htmlFor) {
        attributes.unshift(`for="${escapeAttribute(node.htmlFor)}"`);
    }

    return [`${indent(level)}${openingTag(tag, attributes)}${escapeText(node.text)}</${tag}>`];
}

function renderLayoutNode(
    document: DesignDocument,
    node: LayoutNode,
    level: number
): readonly string[] {
    const tag = layoutTag(node);
    const attributes = [classAttribute(node)];

    if (node.label) {
        attributes.unshift(`aria-label="${escapeAttribute(node.label)}"`);
    }

    const lines = [`${indent(level)}${openingTag(tag, attributes)}`];

    for (const childId of node.children) {
        lines.push(...renderNode(document, childId, level + 1));
    }

    lines.push(`${indent(level)}</${tag}>`);
    return lines;
}

function slotChildren(node: ComponentNode, slot: string): readonly string[] {
    return node.slots[slot] ?? [];
}

function renderSlotChildren(
    document: DesignDocument,
    node: ComponentNode,
    slot: string,
    level: number
): readonly string[] {
    return slotChildren(node, slot).flatMap((nodeId) => renderNode(document, nodeId, level));
}

function renderWrappedSlot(
    document: DesignDocument,
    node: ComponentNode,
    slot: string,
    tag: string,
    level: number
): readonly string[] {
    const children = slotChildren(node, slot);

    if (children.length === 0) {
        return [];
    }

    return [
        `${indent(level)}<${tag}>`,
        ...renderSlotChildren(document, node, slot, level + 1),
        `${indent(level)}</${tag}>`
    ];
}

function renderAlert(
    document: DesignDocument,
    node: ComponentNode,
    level: number
): readonly string[] {
    const attributes = [...componentAttributes(node), classAttribute(node)];
    return [
        `${indent(level)}${openingTag('Alert.Root', attributes)}`,
        ...renderWrappedSlot(document, node, 'title', 'Alert.Title', level + 1),
        ...renderWrappedSlot(document, node, 'description', 'Alert.Description', level + 1),
        `${indent(level)}</Alert.Root>`
    ];
}

function renderAvatar(node: ComponentNode, level: number): readonly string[] {
    const props = materializeComponentProps(node.family, node.props);
    const rootAttributes = [
        ...componentAttributes(node, new Set(['size', 'shape'])),
        classAttribute(node)
    ];
    const lines = [`${indent(level)}${openingTag('Avatar.Root', rootAttributes)}`];

    if (Object.hasOwn(node.props, 'src')) {
        lines.push(
            `${indent(level + 1)}${selfClosingTag(
                'Avatar.Image',
                componentAttributes(node, new Set(['src', 'alt']))
            )}`
        );
    }

    const fallback = props.fallback;

    if (typeof fallback !== 'string') {
        throw new CodeGenerationError('avatar.fallback', 'Avatar fallback must be a string.');
    }

    lines.push(
        `${indent(level + 1)}<Avatar.Fallback>${escapeText(fallback)}</Avatar.Fallback>`,
        `${indent(level)}</Avatar.Root>`
    );
    return lines;
}

function renderCard(
    document: DesignDocument,
    node: ComponentNode,
    level: number
): readonly string[] {
    const attributes = [...componentAttributes(node), classAttribute(node)];
    const lines = [`${indent(level)}${openingTag('Card.Root', attributes)}`];
    const hasHeader =
        slotChildren(node, 'title').length > 0 || slotChildren(node, 'description').length > 0;

    if (hasHeader) {
        lines.push(`${indent(level + 1)}<Card.Header>`);
        lines.push(...renderWrappedSlot(document, node, 'title', 'Card.Title', level + 2));
        lines.push(
            ...renderWrappedSlot(document, node, 'description', 'Card.Description', level + 2)
        );
        lines.push(`${indent(level + 1)}</Card.Header>`);
    }

    lines.push(...renderWrappedSlot(document, node, 'content', 'Card.Content', level + 1));
    lines.push(...renderWrappedSlot(document, node, 'footer', 'Card.Footer', level + 1));
    lines.push(`${indent(level)}</Card.Root>`);
    return lines;
}

function renderContentComponent(
    document: DesignDocument,
    node: ComponentNode,
    symbol: string,
    level: number
): readonly string[] {
    const attributes = [...componentAttributes(node), classAttribute(node)];
    return [
        `${indent(level)}${openingTag(symbol, attributes)}`,
        ...renderSlotChildren(document, node, 'content', level + 1),
        `${indent(level)}</${symbol}>`
    ];
}

function renderLeafComponent(
    node: ComponentNode,
    symbol: string,
    level: number
): readonly string[] {
    const attributes = [...componentAttributes(node), classAttribute(node)];
    return [`${indent(level)}${selfClosingTag(symbol, attributes)}`];
}

function renderComponentNode(
    document: DesignDocument,
    node: ComponentNode,
    level: number
): readonly string[] {
    switch (node.family) {
        case 'alert':
            return renderAlert(document, node, level);
        case 'avatar':
            return renderAvatar(node, level);
        case 'badge':
            return renderContentComponent(document, node, 'Badge', level);
        case 'button':
            return renderContentComponent(document, node, 'Button', level);
        case 'card':
            return renderCard(document, node, level);
        case 'label':
            return renderContentComponent(document, node, 'Label', level);
        case 'checkbox':
            return renderLeafComponent(node, 'Checkbox', level);
        case 'input':
            return renderLeafComponent(node, 'Input', level);
        case 'progress':
            return renderLeafComponent(node, 'Progress', level);
        case 'skeleton':
            return renderLeafComponent(node, 'Skeleton', level);
        case 'switch':
            return renderLeafComponent(node, 'Switch', level);
        case 'textarea':
            return renderLeafComponent(node, 'Textarea', level);
    }
}

function renderNode(document: DesignDocument, nodeId: string, level: number): readonly string[] {
    const node = document.nodes[nodeId];

    if (!node) {
        throw new CodeGenerationError('node.missing', `Node ${nodeId} does not exist.`);
    }

    switch (node.kind) {
        case 'layout':
            return renderLayoutNode(document, node, level);
        case 'text':
            return renderTextNode(node, level);
        case 'component':
            return renderComponentNode(document, node, level);
    }
}

function collectFamilies(document: DesignDocument, rootNodeId: string): readonly CatalogFamily[] {
    const families = new Set<CatalogFamily>();
    const pending = [rootNodeId];
    const visited = new Set<string>();

    while (pending.length > 0) {
        const nodeId = pending.pop();

        if (!nodeId || visited.has(nodeId)) {
            continue;
        }

        visited.add(nodeId);
        const node = document.nodes[nodeId];

        if (!node) {
            continue;
        }

        if (node.kind === 'layout') {
            pending.push(...node.children);
        } else if (node.kind === 'component') {
            families.add(node.family);

            for (const children of Object.values(node.slots)) {
                pending.push(...children);
            }
        }
    }

    return [...families].sort((left, right) => {
        const leftSymbol = getCatalogDefinition(left).packageImport.symbol;
        const rightSymbol = getCatalogDefinition(right).packageImport.symbol;
        return compareStrings(leftSymbol, rightSymbol);
    });
}

function importBlock(families: readonly CatalogFamily[]): readonly string[] {
    if (families.length === 0) {
        return [];
    }

    const symbols = families.map((family) => getCatalogDefinition(family).packageImport.symbol);
    return [
        '<script lang="ts">',
        `    import { ${symbols.join(', ')} } from '@sivir-ui/svelte';`,
        '</script>',
        ''
    ];
}

function componentBaseName(value: string, index: number): string {
    const words = value.match(/[A-Za-z0-9]+/g) ?? [];
    let name = words.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join('');

    if (name === '') {
        name = `Screen${index + 1}`;
    }

    if (/^[0-9]/.test(name)) {
        name = `Screen${name}`;
    }

    return name;
}

function assignComponentNames(pages: readonly DesignPage[]): ReadonlyMap<string, string> {
    const names = new Map<string, string>();
    const counts = new Map<string, number>();

    for (const [index, page] of pages.entries()) {
        const base = componentBaseName(page.name, index);
        const count = (counts.get(base) ?? 0) + 1;
        counts.set(base, count);
        names.set(page.id, count === 1 ? base : `${base}${count}`);
    }

    return names;
}

function renderScreen(document: DesignDocument, page: DesignPage): string {
    const families = collectFamilies(document, page.rootNodeId);
    const lines = [
        ...importBlock(families),
        '<svelte:head>',
        `    <title>${escapeText(page.name)}</title>`,
        '</svelte:head>',
        '',
        ...renderNode(document, page.rootNodeId, 0)
    ];

    return `${lines.join('\n')}\n`;
}

function integrationReadme(
    document: DesignDocument,
    pages: readonly { readonly page: DesignPage; readonly path: string }[]
): string {
    const lines = [
        '# Sivir Design export',
        '',
        `Generated with catalog ${CATALOG_VERSION} and generator ${GENERATOR_VERSION}.`,
        '',
        `Install \`@sivir-ui/svelte@${document.compatibility.sivirPackageVersion}\`, import`,
        '`@sivir-ui/svelte/ui.css` once in your app stylesheet, and copy the generated theme',
        'CSS into your application when theme export is enabled.',
        '',
        '## Screens',
        ''
    ];

    for (const { page, path } of pages) {
        lines.push(`- \`${page.route}\`: \`${path}\``);
    }

    return `${lines.join('\n')}\n`;
}

function ensureCompatibility(document: DesignDocument): void {
    if (document.compatibility.catalogVersion !== CATALOG_VERSION) {
        throw new CodeGenerationError(
            'compatibility.catalog',
            `Document catalog ${document.compatibility.catalogVersion} does not match ${CATALOG_VERSION}.`
        );
    }

    if (document.compatibility.generatorVersion !== GENERATOR_VERSION) {
        throw new CodeGenerationError(
            'compatibility.generator',
            `Document generator ${document.compatibility.generatorVersion} does not match ${GENERATOR_VERSION}.`
        );
    }
}

function validateGeneratedProps(document: DesignDocument): void {
    for (const node of Object.values(document.nodes)) {
        if (node.kind !== 'component') {
            continue;
        }

        const definition: CatalogDefinition = getCatalogDefinition(node.family);

        if (definition.adapter.codegenId !== `sivir.${node.family}.codegen.v1`) {
            throw new CodeGenerationError(
                'adapter.codegen',
                `Component ${node.id} does not have a supported code generation adapter.`
            );
        }
    }
}

export function generateSvelteProject(
    input: DesignDocument,
    options: GenerateOptions = {}
): GeneratedProject {
    const document = parseDesignDocument(input);
    ensureCompatibility(document);
    validateGeneratedProps(document);

    const names = assignComponentNames(document.pages);
    const screens = document.pages.map((page) => {
        const name = names.get(page.id);

        if (!name) {
            throw new CodeGenerationError('page.name', `Page ${page.id} has no generated name.`);
        }

        const path = `src/lib/screens/${name}.svelte`;
        return {
            page,
            path,
            file: { path, content: renderScreen(document, page) }
        };
    });
    const files: GeneratedFile[] = [
        ...screens.map((screen) => screen.file),
        {
            path: 'README.md',
            content: integrationReadme(document, screens)
        }
    ];

    if (options.includeTheme !== false) {
        files.push({
            path: 'src/theme.css',
            content: themeToCss(document.appearance.theme).replaceAll('\r\n', '\n')
        });
    }

    const manifestPath = 'sivir-design.export.json';
    const manifest = {
        format: EXPORT_MANIFEST_FORMAT,
        version: 1,
        generatorVersion: GENERATOR_VERSION,
        catalogVersion: CATALOG_VERSION,
        sivirPackageVersion: document.compatibility.sivirPackageVersion,
        files: [...files.map((file) => file.path), manifestPath].sort()
    };
    files.push({ path: manifestPath, content: `${stableStringify(manifest)}\n` });
    files.sort((left, right) => compareStrings(left.path, right.path));

    return {
        generatorVersion: GENERATOR_VERSION,
        catalogVersion: CATALOG_VERSION,
        files
    };
}

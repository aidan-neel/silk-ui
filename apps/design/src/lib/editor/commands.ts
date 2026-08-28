import type { Theme } from '@sivir-ui/svelte/themes/theme';
import { getCatalogDefinition } from '../catalog/catalog';
import { deriveParentReferences, parseDesignDocument } from '../document/schema';
import type {
    Breakpoint,
    DesignDocument,
    DesignNode,
    DesignPage,
    JsonValue,
    ParentReference
} from '../document/types';

export type ChildLocation = {
    readonly parentId: string;
    readonly slot: string | null;
    readonly index: number;
};

export type ResponsiveGroup = 'style' | 'layoutStyle' | 'typography';

export type DesignCommand =
    | { readonly type: 'noop' }
    | { readonly type: 'set-document-name'; readonly name: string }
    | { readonly type: 'rename-page'; readonly pageId: string; readonly name: string }
    | {
          readonly type: 'insert-page';
          readonly page: DesignPage;
          readonly nodes: Readonly<Record<string, DesignNode>>;
          readonly index: number;
      }
    | { readonly type: 'remove-page'; readonly pageId: string }
    | { readonly type: 'set-text'; readonly nodeId: string; readonly text: string }
    | {
          readonly type: 'set-component-prop';
          readonly nodeId: string;
          readonly prop: string;
          readonly value: JsonValue;
      }
    | { readonly type: 'unset-component-prop'; readonly nodeId: string; readonly prop: string }
    | {
          readonly type: 'set-responsive-value';
          readonly nodeId: string;
          readonly group: ResponsiveGroup;
          readonly property: string;
          readonly breakpoint: Breakpoint;
          readonly value: string;
      }
    | {
          readonly type: 'remove-responsive-override';
          readonly nodeId: string;
          readonly group: ResponsiveGroup;
          readonly property: string;
          readonly breakpoint: Exclude<Breakpoint, 'base'>;
      }
    | { readonly type: 'set-theme'; readonly theme: Theme }
    | { readonly type: 'set-color-mode'; readonly colorMode: 'light' | 'dark' }
    | {
          readonly type: 'insert-subtree';
          readonly rootNodeId: string;
          readonly nodes: Readonly<Record<string, DesignNode>>;
          readonly location: ChildLocation;
      }
    | { readonly type: 'remove-node'; readonly nodeId: string }
    | {
          readonly type: 'move-node';
          readonly nodeId: string;
          readonly location: ChildLocation;
      }
    | {
          readonly type: 'duplicate-subtree';
          readonly nodeId: string;
          readonly idMap: Readonly<Record<string, string>>;
          readonly location: ChildLocation;
      }
    | { readonly type: 'batch'; readonly commands: readonly DesignCommand[] };

export type AppliedCommand = {
    readonly document: DesignDocument;
    readonly inverse: DesignCommand;
    readonly affectedIds: readonly string[];
};

type InternalResult = {
    readonly document: DesignDocument;
    readonly inverse: DesignCommand;
    readonly affectedIds: readonly string[];
};

export class DesignCommandError extends Error {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = 'DesignCommandError';
        this.code = code;
    }
}

function requireNode(document: DesignDocument, nodeId: string): DesignNode {
    const node = document.nodes[nodeId];

    if (!node) {
        throw new DesignCommandError('node.missing', `Node ${nodeId} does not exist.`);
    }

    return node;
}

function replaceNode(document: DesignDocument, node: DesignNode): DesignDocument {
    return {
        ...document,
        nodes: {
            ...document.nodes,
            [node.id]: node
        }
    };
}

function uniqueIds(ids: readonly string[]): readonly string[] {
    return [...new Set(ids)].sort();
}

function childIds(node: DesignNode): readonly string[] {
    if (node.kind === 'layout') {
        return node.children;
    }

    if (node.kind === 'component') {
        return Object.keys(node.slots)
            .sort()
            .flatMap((slot) => node.slots[slot]);
    }

    return [];
}

function collectSubtree(document: DesignDocument, rootNodeId: string): Record<string, DesignNode> {
    const collected: Record<string, DesignNode> = {};
    const pending = [rootNodeId];

    while (pending.length > 0) {
        const nodeId = pending.pop();

        if (!nodeId || Object.hasOwn(collected, nodeId)) {
            continue;
        }

        const node = requireNode(document, nodeId);
        collected[nodeId] = structuredClone(node);
        pending.push(...childIds(node));
    }

    return collected;
}

function replaceChildList(
    parent: DesignNode,
    slot: string | null,
    children: readonly string[]
): DesignNode {
    if (parent.kind === 'layout') {
        if (slot !== null) {
            throw new DesignCommandError('location.slot', 'Layout nodes do not use named slots.');
        }

        return { ...parent, children };
    }

    if (parent.kind === 'component') {
        if (slot === null) {
            throw new DesignCommandError('location.slot', 'Component nodes require a named slot.');
        }

        const definition = getCatalogDefinition(parent.family);

        if (!definition.slots.some((candidate) => candidate.id === slot)) {
            throw new DesignCommandError(
                'location.slot',
                `Component ${parent.family} does not contain slot ${slot}.`
            );
        }

        return {
            ...parent,
            slots: {
                ...parent.slots,
                [slot]: children
            }
        };
    }

    throw new DesignCommandError('location.parent', 'Text nodes cannot contain children.');
}

function getChildList(parent: DesignNode, slot: string | null): readonly string[] {
    if (parent.kind === 'layout') {
        if (slot !== null) {
            throw new DesignCommandError('location.slot', 'Layout nodes do not use named slots.');
        }

        return parent.children;
    }

    if (parent.kind === 'component') {
        if (slot === null) {
            throw new DesignCommandError('location.slot', 'Component nodes require a named slot.');
        }

        const definition = getCatalogDefinition(parent.family);

        if (!definition.slots.some((candidate) => candidate.id === slot)) {
            throw new DesignCommandError(
                'location.slot',
                `Component ${parent.family} does not contain slot ${slot}.`
            );
        }

        return parent.slots[slot] ?? [];
    }

    throw new DesignCommandError('location.parent', 'Text nodes cannot contain children.');
}

function attachChild(
    document: DesignDocument,
    nodeId: string,
    location: ChildLocation
): DesignDocument {
    const parent = requireNode(document, location.parentId);
    const children = getChildList(parent, location.slot);

    if (location.index < 0 || location.index > children.length) {
        throw new DesignCommandError(
            'location.index',
            `Insertion index ${location.index} is outside the destination.`
        );
    }

    if (children.includes(nodeId)) {
        throw new DesignCommandError(
            'location.duplicate',
            `Node ${nodeId} is already in this parent.`
        );
    }

    const nextChildren = [...children];
    nextChildren.splice(location.index, 0, nodeId);
    return replaceNode(document, replaceChildList(parent, location.slot, nextChildren));
}

function detachChild(
    document: DesignDocument,
    nodeId: string,
    reference: ParentReference
): DesignDocument {
    const parent = requireNode(document, reference.parentId);
    const children = getChildList(parent, reference.slot);

    if (children[reference.index] !== nodeId) {
        throw new DesignCommandError('location.stale', `Parent reference for ${nodeId} is stale.`);
    }

    const nextChildren = [...children];
    nextChildren.splice(reference.index, 1);
    return replaceNode(document, replaceChildList(parent, reference.slot, nextChildren));
}

function addNodes(
    document: DesignDocument,
    nodes: Readonly<Record<string, DesignNode>>
): DesignDocument {
    const nextNodes: Record<string, DesignNode> = { ...document.nodes };

    for (const [id, node] of Object.entries(nodes)) {
        if (Object.hasOwn(nextNodes, id)) {
            throw new DesignCommandError('node.exists', `Node ${id} already exists.`);
        }

        nextNodes[id] = structuredClone(node);
    }

    return { ...document, nodes: nextNodes };
}

function removeNodes(document: DesignDocument, nodeIds: readonly string[]): DesignDocument {
    const removed = new Set(nodeIds);
    const nextNodes: Record<string, DesignNode> = {};

    for (const [id, node] of Object.entries(document.nodes)) {
        if (!removed.has(id)) {
            nextNodes[id] = node;
        }
    }

    return { ...document, nodes: nextNodes };
}

function updateResponsiveValue(
    node: DesignNode,
    groupName: ResponsiveGroup,
    property: string,
    breakpoint: Breakpoint,
    value: string | undefined
): DesignNode {
    if (groupName === 'layoutStyle' && node.kind !== 'layout') {
        throw new DesignCommandError('responsive.group', 'Only layout nodes have layout styles.');
    }

    if (groupName === 'typography' && node.kind !== 'text') {
        throw new DesignCommandError('responsive.group', 'Only text nodes have typography styles.');
    }

    const group = node[groupName as keyof DesignNode];

    if (typeof group !== 'object' || group === null || Array.isArray(group)) {
        throw new DesignCommandError('responsive.group', `Node does not contain ${groupName}.`);
    }

    const groupRecord = group as unknown as Record<string, unknown>;
    const responsive = groupRecord[property];

    if (typeof responsive !== 'object' || responsive === null || Array.isArray(responsive)) {
        throw new DesignCommandError(
            'responsive.property',
            `Responsive property ${groupName}.${property} does not exist.`
        );
    }

    const nextResponsive: Record<string, unknown> = { ...(responsive as Record<string, unknown>) };

    if (value === undefined) {
        delete nextResponsive[breakpoint];
    } else {
        nextResponsive[breakpoint] = value;
    }

    const nextGroup = {
        ...groupRecord,
        [property]: nextResponsive
    };

    return {
        ...node,
        [groupName]: nextGroup
    } as DesignNode;
}

function getResponsiveValue(
    node: DesignNode,
    groupName: ResponsiveGroup,
    property: string,
    breakpoint: Breakpoint
): { readonly present: boolean; readonly value: unknown } {
    const group = node[groupName as keyof DesignNode];

    if (typeof group !== 'object' || group === null || Array.isArray(group)) {
        throw new DesignCommandError('responsive.group', `Node does not contain ${groupName}.`);
    }

    const responsive = (group as unknown as Record<string, unknown>)[property];

    if (typeof responsive !== 'object' || responsive === null || Array.isArray(responsive)) {
        throw new DesignCommandError(
            'responsive.property',
            `Responsive property ${groupName}.${property} does not exist.`
        );
    }

    const record = responsive as Record<string, unknown>;
    return {
        present: Object.hasOwn(record, breakpoint),
        value: record[breakpoint]
    };
}

function remapNode(node: DesignNode, idMap: Readonly<Record<string, string>>): DesignNode {
    const remappedId = idMap[node.id];

    if (!remappedId) {
        throw new DesignCommandError('duplicate.id-map', `Missing duplicate ID for ${node.id}.`);
    }

    if (node.kind === 'layout') {
        return {
            ...structuredClone(node),
            id: remappedId,
            children: node.children.map((childId) => {
                const mapped = idMap[childId];

                if (!mapped) {
                    throw new DesignCommandError(
                        'duplicate.id-map',
                        `Missing duplicate ID for ${childId}.`
                    );
                }

                return mapped;
            })
        };
    }

    if (node.kind === 'component') {
        const slots: Record<string, readonly string[]> = {};

        for (const [slot, children] of Object.entries(node.slots)) {
            slots[slot] = children.map((childId) => {
                const mapped = idMap[childId];

                if (!mapped) {
                    throw new DesignCommandError(
                        'duplicate.id-map',
                        `Missing duplicate ID for ${childId}.`
                    );
                }

                return mapped;
            });
        }

        return {
            ...structuredClone(node),
            id: remappedId,
            slots
        };
    }

    return {
        ...structuredClone(node),
        id: remappedId
    };
}

function applyInternal(document: DesignDocument, command: DesignCommand): InternalResult {
    switch (command.type) {
        case 'noop':
            return { document, inverse: command, affectedIds: [] };
        case 'set-document-name':
            return {
                document: { ...document, name: command.name },
                inverse: { type: 'set-document-name', name: document.name },
                affectedIds: [document.id]
            };
        case 'rename-page': {
            const index = document.pages.findIndex((page) => page.id === command.pageId);

            if (index === -1) {
                throw new DesignCommandError(
                    'page.missing',
                    `Page ${command.pageId} does not exist.`
                );
            }

            const page = document.pages[index];
            const pages = [...document.pages];
            pages[index] = { ...page, name: command.name };
            return {
                document: { ...document, pages },
                inverse: { type: 'rename-page', pageId: page.id, name: page.name },
                affectedIds: [page.id]
            };
        }
        case 'insert-page': {
            if (document.pages.some((page) => page.id === command.page.id)) {
                throw new DesignCommandError(
                    'page.exists',
                    `Page ${command.page.id} already exists.`
                );
            }

            if (command.index < 0 || command.index > document.pages.length) {
                throw new DesignCommandError(
                    'page.index',
                    'Page insertion index is outside the list.'
                );
            }

            let next = addNodes(document, command.nodes);
            const pages = [...next.pages];
            pages.splice(command.index, 0, structuredClone(command.page));
            next = { ...next, pages };
            return {
                document: next,
                inverse: { type: 'remove-page', pageId: command.page.id },
                affectedIds: [command.page.id, ...Object.keys(command.nodes)]
            };
        }
        case 'remove-page': {
            if (document.pages.length === 1) {
                throw new DesignCommandError(
                    'page.last',
                    'A document must retain at least one page.'
                );
            }

            const index = document.pages.findIndex((page) => page.id === command.pageId);

            if (index === -1) {
                throw new DesignCommandError(
                    'page.missing',
                    `Page ${command.pageId} does not exist.`
                );
            }

            const page = document.pages[index];
            const subtree = collectSubtree(document, page.rootNodeId);
            const pages = document.pages.filter((candidate) => candidate.id !== page.id);
            const next = removeNodes({ ...document, pages }, Object.keys(subtree));
            return {
                document: next,
                inverse: {
                    type: 'insert-page',
                    page: structuredClone(page),
                    nodes: subtree,
                    index
                },
                affectedIds: [page.id, ...Object.keys(subtree)]
            };
        }
        case 'set-text': {
            const node = requireNode(document, command.nodeId);

            if (node.kind !== 'text') {
                throw new DesignCommandError('node.kind', 'Only text nodes contain editable text.');
            }

            return {
                document: replaceNode(document, { ...node, text: command.text }),
                inverse: { type: 'set-text', nodeId: node.id, text: node.text },
                affectedIds: [node.id]
            };
        }
        case 'set-component-prop': {
            const node = requireNode(document, command.nodeId);

            if (node.kind !== 'component') {
                throw new DesignCommandError('node.kind', 'Only component nodes contain props.');
            }

            const hadValue = Object.hasOwn(node.props, command.prop);
            const oldValue = node.props[command.prop];
            const next = replaceNode(document, {
                ...node,
                props: { ...node.props, [command.prop]: structuredClone(command.value) }
            });
            const inverse: DesignCommand = hadValue
                ? {
                      type: 'set-component-prop',
                      nodeId: node.id,
                      prop: command.prop,
                      value: oldValue
                  }
                : { type: 'unset-component-prop', nodeId: node.id, prop: command.prop };
            return { document: next, inverse, affectedIds: [node.id] };
        }
        case 'unset-component-prop': {
            const node = requireNode(document, command.nodeId);

            if (node.kind !== 'component') {
                throw new DesignCommandError('node.kind', 'Only component nodes contain props.');
            }

            if (!Object.hasOwn(node.props, command.prop)) {
                return { document, inverse: { type: 'noop' }, affectedIds: [] };
            }

            const props: Record<string, JsonValue> = {};

            for (const [key, value] of Object.entries(node.props)) {
                if (key !== command.prop) {
                    props[key] = value;
                }
            }

            return {
                document: replaceNode(document, { ...node, props }),
                inverse: {
                    type: 'set-component-prop',
                    nodeId: node.id,
                    prop: command.prop,
                    value: node.props[command.prop]
                },
                affectedIds: [node.id]
            };
        }
        case 'set-responsive-value': {
            const node = requireNode(document, command.nodeId);
            const previous = getResponsiveValue(
                node,
                command.group,
                command.property,
                command.breakpoint
            );
            const nextNode = updateResponsiveValue(
                node,
                command.group,
                command.property,
                command.breakpoint,
                command.value
            );
            const inverse: DesignCommand = previous.present
                ? {
                      ...command,
                      value: String(previous.value)
                  }
                : command.breakpoint === 'base'
                  ? { type: 'noop' }
                  : {
                        type: 'remove-responsive-override',
                        nodeId: node.id,
                        group: command.group,
                        property: command.property,
                        breakpoint: command.breakpoint
                    };
            return {
                document: replaceNode(document, nextNode),
                inverse,
                affectedIds: [node.id]
            };
        }
        case 'remove-responsive-override': {
            const node = requireNode(document, command.nodeId);
            const previous = getResponsiveValue(
                node,
                command.group,
                command.property,
                command.breakpoint
            );

            if (!previous.present) {
                return { document, inverse: { type: 'noop' }, affectedIds: [] };
            }

            const nextNode = updateResponsiveValue(
                node,
                command.group,
                command.property,
                command.breakpoint,
                undefined
            );
            return {
                document: replaceNode(document, nextNode),
                inverse: {
                    type: 'set-responsive-value',
                    nodeId: node.id,
                    group: command.group,
                    property: command.property,
                    breakpoint: command.breakpoint,
                    value: String(previous.value)
                },
                affectedIds: [node.id]
            };
        }
        case 'set-theme':
            return {
                document: {
                    ...document,
                    appearance: { ...document.appearance, theme: structuredClone(command.theme) }
                },
                inverse: { type: 'set-theme', theme: structuredClone(document.appearance.theme) },
                affectedIds: [document.id]
            };
        case 'set-color-mode':
            return {
                document: {
                    ...document,
                    appearance: { ...document.appearance, colorMode: command.colorMode }
                },
                inverse: { type: 'set-color-mode', colorMode: document.appearance.colorMode },
                affectedIds: [document.id]
            };
        case 'insert-subtree': {
            if (!Object.hasOwn(command.nodes, command.rootNodeId)) {
                throw new DesignCommandError(
                    'node.subtree-root',
                    `Inserted subtree does not contain root ${command.rootNodeId}.`
                );
            }

            const withNodes = addNodes(document, command.nodes);
            return {
                document: attachChild(withNodes, command.rootNodeId, command.location),
                inverse: { type: 'remove-node', nodeId: command.rootNodeId },
                affectedIds: [command.location.parentId, ...Object.keys(command.nodes)]
            };
        }
        case 'remove-node': {
            if (document.pages.some((page) => page.rootNodeId === command.nodeId)) {
                throw new DesignCommandError(
                    'node.page-root',
                    'Page root nodes cannot be removed.'
                );
            }

            const reference = deriveParentReferences(document).get(command.nodeId);

            if (!reference) {
                throw new DesignCommandError(
                    'node.parent',
                    `Node ${command.nodeId} has no parent.`
                );
            }

            const subtree = collectSubtree(document, command.nodeId);
            const detached = detachChild(document, command.nodeId, reference);
            const next = removeNodes(detached, Object.keys(subtree));
            return {
                document: next,
                inverse: {
                    type: 'insert-subtree',
                    rootNodeId: command.nodeId,
                    nodes: subtree,
                    location: reference
                },
                affectedIds: [reference.parentId, ...Object.keys(subtree)]
            };
        }
        case 'move-node': {
            if (document.pages.some((page) => page.rootNodeId === command.nodeId)) {
                throw new DesignCommandError('node.page-root', 'Page root nodes cannot be moved.');
            }

            const reference = deriveParentReferences(document).get(command.nodeId);

            if (!reference) {
                throw new DesignCommandError(
                    'node.parent',
                    `Node ${command.nodeId} has no parent.`
                );
            }

            const descendants = collectSubtree(document, command.nodeId);

            if (Object.hasOwn(descendants, command.location.parentId)) {
                throw new DesignCommandError(
                    'node.cycle',
                    'A node cannot move inside its own subtree.'
                );
            }

            const detached = detachChild(document, command.nodeId, reference);
            const next = attachChild(detached, command.nodeId, command.location);
            return {
                document: next,
                inverse: {
                    type: 'move-node',
                    nodeId: command.nodeId,
                    location: reference
                },
                affectedIds: [command.nodeId, reference.parentId, command.location.parentId]
            };
        }
        case 'duplicate-subtree': {
            const source = collectSubtree(document, command.nodeId);
            const sourceIds = Object.keys(source).sort();
            const mapKeys = Object.keys(command.idMap).sort();

            if (
                sourceIds.length !== mapKeys.length ||
                sourceIds.some((id, index) => id !== mapKeys[index])
            ) {
                throw new DesignCommandError(
                    'duplicate.id-map',
                    'Duplicate ID map must contain every source node exactly once.'
                );
            }

            const mappedIds = Object.values(command.idMap);

            if (new Set(mappedIds).size !== mappedIds.length) {
                throw new DesignCommandError('duplicate.id-map', 'Duplicate IDs must be unique.');
            }

            const nodes: Record<string, DesignNode> = {};

            for (const sourceId of sourceIds) {
                const remapped = remapNode(source[sourceId], command.idMap);
                nodes[remapped.id] = remapped;
            }

            const rootNodeId = command.idMap[command.nodeId];

            if (!rootNodeId) {
                throw new DesignCommandError('duplicate.id-map', 'Duplicate root ID is missing.');
            }

            const inserted = applyInternal(document, {
                type: 'insert-subtree',
                rootNodeId,
                nodes,
                location: command.location
            });
            return {
                document: inserted.document,
                inverse: inserted.inverse,
                affectedIds: inserted.affectedIds
            };
        }
        case 'batch': {
            let current = document;
            const inverses: DesignCommand[] = [];
            const affectedIds: string[] = [];

            for (const childCommand of command.commands) {
                const result = applyInternal(current, childCommand);
                current = result.document;
                inverses.unshift(result.inverse);
                affectedIds.push(...result.affectedIds);
            }

            return {
                document: current,
                inverse: { type: 'batch', commands: inverses },
                affectedIds: uniqueIds(affectedIds)
            };
        }
    }
}

export function applyDesignCommand(
    inputDocument: DesignDocument,
    command: DesignCommand
): AppliedCommand {
    const document = parseDesignDocument(inputDocument);
    const result = applyInternal(document, command);

    return {
        document: parseDesignDocument(result.document),
        inverse: result.inverse,
        affectedIds: uniqueIds(result.affectedIds)
    };
}

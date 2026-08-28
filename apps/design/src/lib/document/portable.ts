import { parseDesignDocument } from './schema';
import type { DesignDocument, JsonValue } from './types';

export const PORTABLE_PROJECT_FORMAT = 'sivir-design/project' as const;
export const PORTABLE_PROJECT_VERSION = 1 as const;
export const MAX_PORTABLE_PROJECT_BYTES = 10 * 1024 * 1024;

const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

export type PortableProject = {
    readonly format: typeof PORTABLE_PROJECT_FORMAT;
    readonly version: typeof PORTABLE_PROJECT_VERSION;
    readonly document: DesignDocument;
};

export class PortableProjectError extends TypeError {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = 'PortableProjectError';
        this.code = code;
    }
}

function canonicalize(value: unknown, ancestors: ReadonlySet<object>): JsonValue {
    if (value === null || typeof value === 'string' || typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'number') {
        if (!Number.isFinite(value)) {
            throw new PortableProjectError('json.number', 'JSON numbers must be finite.');
        }

        return value;
    }

    if (typeof value !== 'object' || value === null) {
        throw new PortableProjectError('json.type', 'Only closed JSON values can be serialized.');
    }

    if (ancestors.has(value)) {
        throw new PortableProjectError('json.cycle', 'JSON values must not contain cycles.');
    }

    const nextAncestors = new Set(ancestors);
    nextAncestors.add(value);

    if (Array.isArray(value)) {
        return value.map((item) => canonicalize(item, nextAncestors));
    }

    const prototype = Object.getPrototypeOf(value);

    if (prototype !== Object.prototype && prototype !== null) {
        throw new PortableProjectError('json.object', 'JSON objects must have a plain prototype.');
    }

    if (Object.getOwnPropertySymbols(value).length > 0) {
        throw new PortableProjectError('json.symbol-key', 'JSON objects must not use symbol keys.');
    }

    const result: Record<string, JsonValue> = Object.create(null) as Record<string, JsonValue>;

    for (const key of Object.keys(value).sort()) {
        if (FORBIDDEN_KEYS.has(key)) {
            throw new PortableProjectError('json.forbidden-key', `Forbidden JSON key: ${key}.`);
        }

        const descriptor = Object.getOwnPropertyDescriptor(value, key);

        if (!descriptor || !Object.hasOwn(descriptor, 'value')) {
            throw new PortableProjectError(
                'json.accessor',
                'JSON objects must contain data properties only.'
            );
        }

        result[key] = canonicalize(descriptor.value, nextAncestors);
    }

    return result;
}

export function stableStringify(value: unknown, spaces = 4): string {
    if (!Number.isInteger(spaces) || spaces < 0 || spaces > 10) {
        throw new RangeError('JSON indentation must be an integer from 0 through 10.');
    }

    return JSON.stringify(canonicalize(value, new Set()), null, spaces);
}

export function exportPortableProject(document: DesignDocument): string {
    const validated = parseDesignDocument(document);
    const project: PortableProject = {
        format: PORTABLE_PROJECT_FORMAT,
        version: PORTABLE_PROJECT_VERSION,
        document: validated
    };

    return `${stableStringify(project)}\n`;
}

export function importPortableProject(source: string): PortableProject {
    const byteLength = new TextEncoder().encode(source).byteLength;

    if (byteLength > MAX_PORTABLE_PROJECT_BYTES) {
        throw new PortableProjectError(
            'project.size',
            `Project files must not exceed ${MAX_PORTABLE_PROJECT_BYTES} bytes.`
        );
    }

    let parsed: unknown;

    try {
        parsed = JSON.parse(source) as unknown;
    } catch {
        throw new PortableProjectError('project.json', 'Project file is not valid JSON.');
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new PortableProjectError('project.envelope', 'Project file must contain an object.');
    }

    const envelope = parsed as Record<string, unknown>;
    const keys = Object.keys(envelope).sort();
    const expectedKeys = ['document', 'format', 'version'];

    if (
        keys.length !== expectedKeys.length ||
        keys.some((key, index) => key !== expectedKeys[index])
    ) {
        throw new PortableProjectError(
            'project.envelope',
            'Project envelope contains unknown or missing fields.'
        );
    }

    if (envelope.format !== PORTABLE_PROJECT_FORMAT) {
        throw new PortableProjectError(
            'project.format',
            `Expected project format ${PORTABLE_PROJECT_FORMAT}.`
        );
    }

    if (envelope.version !== PORTABLE_PROJECT_VERSION) {
        throw new PortableProjectError(
            'project.version',
            `Expected project version ${PORTABLE_PROJECT_VERSION}.`
        );
    }

    return {
        format: PORTABLE_PROJECT_FORMAT,
        version: PORTABLE_PROJECT_VERSION,
        document: parseDesignDocument(envelope.document)
    };
}

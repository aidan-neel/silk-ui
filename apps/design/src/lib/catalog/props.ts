import type { JsonObject, JsonValue } from '../document/types';
import { getCatalogDefinition } from './catalog';
import type {
    CatalogDefinition,
    CatalogFamily,
    CatalogPropSchema,
    CatalogPropValue,
    CatalogValidationIssue
} from './types';

const ID_PATTERN = /^[A-Za-z][A-Za-z0-9_.:-]*$/;

function containsUnsafeControlCharacter(value: string): boolean {
    return [...value].some((character) => {
        const code = character.charCodeAt(0);
        return (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127;
    });
}

export function isSafeCatalogUrl(value: string): boolean {
    if (
        value.trim() !== value ||
        value === '' ||
        value.startsWith('//') ||
        value.includes('\\') ||
        containsUnsafeControlCharacter(value)
    ) {
        return false;
    }

    if (
        value.startsWith('/') ||
        value.startsWith('./') ||
        value.startsWith('../') ||
        value.startsWith('#') ||
        value.startsWith('?')
    ) {
        return true;
    }

    try {
        return new URL(value).protocol === 'https:';
    } catch {
        return false;
    }
}

function validateString(
    schema: Extract<CatalogPropSchema, { kind: 'string' }>,
    value: unknown
): string | undefined {
    if (typeof value !== 'string') {
        return 'must be a string';
    }

    if (value.length < schema.minLength || value.length > schema.maxLength) {
        return `must contain between ${schema.minLength} and ${schema.maxLength} characters`;
    }

    if (containsUnsafeControlCharacter(value)) {
        return 'must not contain control characters';
    }

    if (schema.format === 'url' && !isSafeCatalogUrl(value)) {
        return 'must be an HTTPS URL or a safe relative URL';
    }

    if (schema.format === 'id' && !ID_PATTERN.test(value)) {
        return 'must be a valid HTML ID reference';
    }

    return undefined;
}

function validateProp(schema: CatalogPropSchema, value: unknown): string | undefined {
    switch (schema.kind) {
        case 'string':
            return validateString(schema, value);
        case 'enum':
            if (typeof value !== 'string' || !schema.values.includes(value)) {
                return `must be one of ${schema.values.join(', ')}`;
            }
            return undefined;
        case 'boolean':
            return typeof value === 'boolean' ? undefined : 'must be a boolean';
        case 'number':
            if (typeof value !== 'number' || !Number.isFinite(value)) {
                return 'must be a finite number';
            }
            if (value < schema.min || value > schema.max) {
                return `must be between ${schema.min} and ${schema.max}`;
            }
            if (schema.integer && !Number.isInteger(value)) {
                return 'must be an integer';
            }
            return undefined;
    }
}

export function validateComponentProps(
    definition: CatalogDefinition,
    value: unknown,
    path = 'props'
): readonly CatalogValidationIssue[] {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return [{ path, message: 'must be an object' }];
    }

    const record = value as Record<string, unknown>;
    const schemas = new Map(definition.props.map((schema) => [schema.name, schema]));
    const issues: CatalogValidationIssue[] = [];

    for (const key of Object.keys(record)) {
        const schema = schemas.get(key);

        if (!schema) {
            issues.push({ path: `${path}.${key}`, message: 'is not an editable prop' });
            continue;
        }

        const message = validateProp(schema, record[key]);

        if (message) {
            issues.push({ path: `${path}.${key}`, message });
        }
    }

    for (const schema of definition.props) {
        if (schema.required && !Object.hasOwn(record, schema.name)) {
            issues.push({ path: `${path}.${schema.name}`, message: 'is required' });
        }
    }

    if (
        definition.family === 'avatar' &&
        Object.hasOwn(record, 'src') &&
        !Object.hasOwn(record, 'alt')
    ) {
        issues.push({
            path: `${path}.alt`,
            message: 'must be explicit when an avatar image URL is present'
        });
    }

    return issues;
}

function hasDefaultValue(
    schema: CatalogPropSchema
): schema is CatalogPropSchema & { readonly defaultValue: CatalogPropValue } {
    return Object.hasOwn(schema, 'defaultValue');
}

export function materializeComponentProps(family: CatalogFamily, props: JsonObject): JsonObject {
    const definition = getCatalogDefinition(family);
    const result: Record<string, JsonValue> = {};

    for (const schema of definition.props) {
        if (Object.hasOwn(props, schema.name)) {
            result[schema.name] = props[schema.name];
        } else if (hasDefaultValue(schema)) {
            result[schema.name] = schema.defaultValue;
        }
    }

    return result;
}

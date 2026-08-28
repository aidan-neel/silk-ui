import { describe, expect, it } from 'vitest';
import { stableStringify } from '../document/portable';
import { COMPONENT_CATALOG } from './catalog';
import { isSafeCatalogUrl, materializeComponentProps, validateComponentProps } from './props';
import { CATALOG_FAMILIES } from './types';

describe('private component catalog', () => {
    it('defines exactly the twelve supported families with unique versioned adapters', () => {
        expect(COMPONENT_CATALOG.map((definition) => definition.family)).toEqual(CATALOG_FAMILIES);
        expect(new Set(COMPONENT_CATALOG.map((definition) => definition.adapter.id)).size).toBe(
            COMPONENT_CATALOG.length
        );

        for (const definition of COMPONENT_CATALOG) {
            expect(definition.adapter.version).toBeGreaterThan(0);
            expect(definition.adapter.previewId).toContain(definition.family);
            expect(definition.adapter.codegenId).toContain(definition.family);
            expect(definition.templates).toHaveLength(1);
            expect(definition.status).toBe('supported');
            expect(definition.authoring.allowedParentKinds).toEqual(['layout', 'component']);
            expect(definition.authoring.portal).toBe('none');
        }
    });

    it('keeps catalog metadata and prop defaults JSON serializable', () => {
        expect(() => stableStringify(COMPONENT_CATALOG)).not.toThrow();

        for (const definition of COMPONENT_CATALOG) {
            const defaults = materializeComponentProps(
                definition.family,
                definition.family === 'label' ? { htmlFor: 'field-id' } : {}
            );
            expect(validateComponentProps(definition, defaults)).toEqual([]);
        }
    });

    it('permits only HTTPS and explicit relative URLs', () => {
        expect(isSafeCatalogUrl('https://example.com/avatar.png')).toBe(true);
        expect(isSafeCatalogUrl('/avatar.png')).toBe(true);
        expect(isSafeCatalogUrl('../avatar.png')).toBe(true);
        expect(isSafeCatalogUrl('http://example.com/avatar.png')).toBe(false);
        expect(isSafeCatalogUrl('//example.com/avatar.png')).toBe(false);
        expect(isSafeCatalogUrl('javascript:alert(1)')).toBe(false);
    });

    it('requires explicit alternative text when an avatar has an image', () => {
        const avatar = COMPONENT_CATALOG.find((definition) => definition.family === 'avatar');

        if (!avatar) {
            throw new Error('Avatar catalog entry is missing.');
        }

        expect(validateComponentProps(avatar, { src: '/avatar.png' })).toContainEqual({
            path: 'props.alt',
            message: 'must be explicit when an avatar image URL is present'
        });
    });
});

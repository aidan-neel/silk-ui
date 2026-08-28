import { compile } from 'svelte/compiler';
import { describe, expect, it } from 'vitest';
import { SAMPLE_DOCUMENT } from '../document/sample';
import { CodeGenerationError, generateSvelteProject } from './generate';

describe('deterministic Svelte generation', () => {
    it('produces byte-identical files with public package imports', () => {
        const first = generateSvelteProject(SAMPLE_DOCUMENT);
        const second = generateSvelteProject(SAMPLE_DOCUMENT);

        expect(second).toEqual(first);
        expect(first.files.map((file) => file.path)).toEqual([
            'README.md',
            'sivir-design.export.json',
            'src/lib/screens/WorkspaceSettings.svelte',
            'src/theme.css'
        ]);

        const screen = first.files.find((file) => file.path.endsWith('.svelte'))?.content;
        expect(screen).toContain(
            "import { Alert, Avatar, Badge, Button, Card, Checkbox, Input, Label, Progress, Skeleton, Switch, Textarea } from '@sivir-ui/svelte';"
        );
        expect(screen).toContain('<Card.Root');
        expect(screen).toContain('<Avatar.Fallback');
        expect(screen).toContain('md:grid-cols-2');
        expect(screen).not.toContain('sivir-design/');
        expect(screen).not.toContain('Date.now');
        expect(() => compile(screen ?? '', { generate: 'client' })).not.toThrow();
    });

    it('can omit theme output without changing screen output', () => {
        const withTheme = generateSvelteProject(SAMPLE_DOCUMENT);
        const withoutTheme = generateSvelteProject(SAMPLE_DOCUMENT, { includeTheme: false });
        const screenWithTheme = withTheme.files.find((file) => file.path.endsWith('.svelte'));
        const screenWithoutTheme = withoutTheme.files.find((file) => file.path.endsWith('.svelte'));

        expect(withoutTheme.files.some((file) => file.path === 'src/theme.css')).toBe(false);
        expect(screenWithoutTheme).toEqual(screenWithTheme);
    });

    it('blocks incompatible catalog versions', () => {
        const document = structuredClone(SAMPLE_DOCUMENT) as unknown as {
            compatibility: {
                catalogVersion: string;
            };
        };
        document.compatibility.catalogVersion = '2.0.0';

        expect(() => generateSvelteProject(document as never)).toThrowError(CodeGenerationError);
    });
});

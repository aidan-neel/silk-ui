import { describe, expect, test } from 'vitest';
import { parseCommandLine } from './terminal-manager';

describe('manual terminal command parsing', () => {
    test('parses plain, quoted, empty, and escaped arguments', () => {
        expect(parseCommandLine('bun add @sivir-ui/svelte@latest')).toEqual([
            'bun',
            'add',
            '@sivir-ui/svelte@latest'
        ]);
        expect(parseCommandLine(`tool "two words" '' escaped\\ value`)).toEqual([
            'tool',
            'two words',
            '',
            'escaped value'
        ]);
    });

    test.each(['bun build && rm -rf x', 'bun build | tee log', 'bun build > log', '(bun build)'])(
        'rejects shell syntax in %s',
        (command) => {
            expect(() => parseCommandLine(command)).toThrow('Run one command at a time');
        }
    );

    test('rejects malformed input', () => {
        expect(() => parseCommandLine('')).toThrow('Enter a command');
        expect(() => parseCommandLine(`bun "unfinished`)).toThrow('unterminated quote');
        expect(() => parseCommandLine('bun unfinished\\')).toThrow('unfinished escape');
    });
});

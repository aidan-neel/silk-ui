import { describe, expect, test } from 'vitest';
import {
    cliCommands,
    combinationKey,
    consumerInstallCommand,
    scaffoldCommands,
    stagingInstallCommand
} from './commands';

describe('installer command construction', () => {
    test.each([
        ['local', 'cli'],
        ['local', 'package'],
        ['npm', 'cli'],
        ['npm', 'package']
    ] as const)('constructs the %s/%s combination without a shell', (source, installPath) => {
        expect(combinationKey(source, installPath)).toBe(`${source}:${installPath}`);
        const staging = stagingInstallCommand(source, '/tmp/stage', '/tmp/sivir.tgz');
        expect(staging.bin).toBe('bun');
        expect(staging.args).toEqual([
            'add',
            source === 'local' ? '/tmp/sivir.tgz' : '@sivir-ui/svelte@latest'
        ]);
        if (installPath === 'cli') {
            const commands = cliCommands('/tmp/stage/node_modules/.bin/sivir', '/tmp/app');
            expect(commands[0].args).toEqual(['--cwd', '/tmp/app', 'init', '-y']);
            expect(commands[1].args).toEqual(['--cwd', '/tmp/app', 'add', '*', '-y']);
        } else {
            expect(
                consumerInstallCommand(source, '/tmp/app', '/tmp/sivir.tgz', '1.2.3').args
            ).toEqual(['add', source === 'local' ? '/tmp/sivir.tgz' : '@sivir-ui/svelte@1.2.3']);
        }
    });

    test('scaffolds TypeScript, adds Tailwind, and installs the default UI font', () => {
        const commands = scaffoldCommands('/tmp/run/consumer');
        expect(commands).toHaveLength(3);
        expect(commands[0].args).toContain('--no-install');
        expect(commands[0].args).toContain('ts');
        expect(commands[1].args).toContain('tailwindcss=plugins:none');
        expect(commands[1].args).toContain('--no-install');
        expect(commands[2]).toMatchObject({
            bin: 'bun',
            args: ['add', '@fontsource/inter@5.3.0']
        });
    });
});

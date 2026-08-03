import { describe, expect, test } from 'vitest';
import type { InstallPath, RunSource } from '$lib/run-types';
import { buildManualPlan } from './manual-plan';
import { manualConsumerRoot, manualRoot } from './paths';

describe('manual command plan', () => {
    for (const source of ['local', 'npm'] satisfies RunSource[]) {
        for (const installPath of ['cli', 'package'] satisfies InstallPath[]) {
            test(`${source}:${installPath} assumes a prepared app and stays relative`, async () => {
                const plan = await buildManualPlan(source, installPath);
                const commands = plan.steps.map((step) => step.command);

                expect(plan.workspace).toBe(manualConsumerRoot);
                expect(new Set(plan.steps.map((step) => step.id)).size).toBe(plan.steps.length);
                expect(commands.some((value) => value.includes('sv create'))).toBe(false);
                expect(commands.some((value) => value.includes('@fontsource/dm-sans'))).toBe(false);
                expect(commands.some((value) => value.startsWith('cd '))).toBe(false);
                for (const value of commands) expect(value).not.toContain(manualRoot);
                expect(commands).toContain('bunx svelte-check --tsconfig ./tsconfig.json');
                expect(commands).toContain('bun run build');
                expect(commands.at(-1)).toContain('--host 127.0.0.1');

                if (installPath === 'cli') {
                    expect(commands).toHaveLength(5);
                    expect(commands[0]).toBe('bunx --no-install sivir init -y');
                    expect(commands[1]).toBe('bunx --no-install sivir add * -y');
                    expect(commands.join('\n')).not.toContain('../staging');
                } else if (source === 'local') {
                    expect(commands).toHaveLength(3);
                    expect(commands.join('\n')).not.toContain('../staging');
                } else {
                    expect(commands).toHaveLength(4);
                    expect(commands[0]).toBe('bun add @sivir-ui/svelte@latest');
                }
            });
        }
    }
});

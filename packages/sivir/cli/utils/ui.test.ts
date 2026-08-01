import { describe, expect, test } from 'bun:test';
import { BANNER } from './ui';

describe('CLI banner', () => {
    test('spells SIVIR', () => {
        expect(BANNER.join('\n')).toMatchInlineSnapshot(`
"█████  █  █   █  █  ████ 
█      █  █   █  █  █   █
█████  █  █   █  █  ████ 
    █  █   █ █   █  █  █ 
█████  █    █    █  █   █"
`);
    });
});

import { describe, expect, test } from 'bun:test';
import { searchCommandItems } from './src/components/command/search';
import type { CommandItem } from './src/components/command';

function item(name: string, id = ''): CommandItem {
    return { id: id || name, name, callback: undefined, ref: undefined, disabled: false };
}

const items: CommandItem[] = [
    item('Home landing page homepage main'),
    item('Introduction getting started'),
    item('Installation setup install'),
    item('Theming tokens colors styling'),
    item('Components catalog index'),
    item('Button button'),
    item('Modal modal'),
    item('Dropdown Menu dropdown-menu'),
    item('Alert Dialog alert-dialog'),
    item('Toast toast'),
    item('Tooltip tooltip'),
    item('Select select'),
    item('Context Menu context-menu'),
    item('Copy Button copy-button'),
    item('Scroll Area scroll-area'),
    item('Badge badge'),
    item('Code Block code-block'),
    item('Color Picker color-picker'),
    item('Radio Group radio-group'),
    item('Slider slider'),
    item('Tabs tabs'),
    item('Textarea textarea'),
    item('Toggle Group toggle-group')
];

function names(items: Iterable<CommandItem>): string[] {
    return [...items].map((item) => item.name.split(' ').slice(0, 2).join(' '));
}

describe('searchCommandItems', () => {
    test('returns all items for an empty query', () => {
        expect(searchCommandItems(items, '')).toHaveLength(items.length);
    });

    test('matches one-character queries', () => {
        expect(names(searchCommandItems(items, 'h'))).toContain('Home landing');
    });

    test('prioritizes exact and word-prefix matches', () => {
        expect(names(searchCommandItems(items, 'modal modal'))).toEqual(['Modal modal']);
        expect(names(searchCommandItems(items, 'styl'))).toEqual(['Theming tokens']);
        expect(names(searchCommandItems(items, 'menu'))).toEqual(['Dropdown Menu', 'Context Menu']);
    });

    test('keeps Fuse typo and phrase matching', () => {
        expect(names(searchCommandItems(items, 'butoon'))).toEqual([
            'Button button',
            'Copy Button'
        ]);
        expect(names(searchCommandItems(items, 'drop down'))).toEqual(['Dropdown Menu']);
    });

    test('finds fuzzy abbreviations within and across words', () => {
        expect(names(searchCommandItems(items, 'btn'))).toEqual(['Button button', 'Copy Button']);
        expect(names(searchCommandItems(items, 'ctx'))).toEqual(['Context Menu']);
        expect(names(searchCommandItems(items, 'dmenu'))).toEqual([
            'Dropdown Menu',
            'Context Menu'
        ]);
        expect(names(searchCommandItems(items, 'drop menu'))).toEqual(['Dropdown Menu']);
    });

    test('does not discard candidates approved by Fuse', () => {
        const ambiguousItems = [item('Drop Down'), item('Dropdown Menu')];
        expect(names(searchCommandItems(ambiguousItems, 'drop down'))).toEqual([
            'Drop Down',
            'Dropdown Menu'
        ]);
    });

    test('does not return unrelated fuzzy matches', () => {
        expect(searchCommandItems(items, 'road')).toHaveLength(0);
        expect(searchCommandItems(items, '--')).toHaveLength(0);
    });

    test('respects stricter custom thresholds', () => {
        expect(searchCommandItems(items, 'btn', 0)).toHaveLength(0);
    });
});

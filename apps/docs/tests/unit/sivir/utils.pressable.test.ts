import { describe, expect, it } from 'vitest';
import { pressable } from '@sivir-ui/svelte/utils';

describe('pressable', () => {
    it('sets constant-pixel scale vars from element size', () => {
        const el = document.createElement('button');
        el.style.width = '400px';
        el.style.height = '40px';
        document.body.appendChild(el);
        // jsdom getBoundingClientRect is 0 unless we stub it
        el.getBoundingClientRect = () => ({
            width: 400,
            height: 40,
            top: 0,
            left: 0,
            bottom: 40,
            right: 400,
            x: 0,
            y: 0,
            toJSON: () => ({})
        });

        const action = pressable(el);
        el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

        // 2px default → (400-2)/400 = 0.995, (40-2)/40 = 0.95
        expect(el.style.getPropertyValue('--sivir-press-sx')).toBe('0.9950');
        expect(el.style.getPropertyValue('--sivir-press-sy')).toBe('0.9500');

        action.destroy();
        el.remove();
    });

    it('respects --motion-press-px', () => {
        const el = document.createElement('button');
        document.body.appendChild(el);
        el.style.setProperty('--motion-press-px', '4px');
        el.getBoundingClientRect = () => ({
            width: 100,
            height: 100,
            top: 0,
            left: 0,
            bottom: 100,
            right: 100,
            x: 0,
            y: 0,
            toJSON: () => ({})
        });

        const action = pressable(el);
        el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

        expect(el.style.getPropertyValue('--sivir-press-sx')).toBe('0.9600');
        expect(el.style.getPropertyValue('--sivir-press-sy')).toBe('0.9600');

        action.destroy();
        el.remove();
    });

    it('clamps tiny controls to the floor so they do not collapse', () => {
        const el = document.createElement('button');
        document.body.appendChild(el);
        el.getBoundingClientRect = () => ({
            width: 16,
            height: 16,
            top: 0,
            left: 0,
            bottom: 16,
            right: 16,
            x: 0,
            y: 0,
            toJSON: () => ({})
        });

        const action = pressable(el);
        el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

        expect(el.style.getPropertyValue('--sivir-press-sx')).toBe('0.9400');
        expect(el.style.getPropertyValue('--sivir-press-sy')).toBe('0.9400');

        action.destroy();
        el.remove();
    });
});

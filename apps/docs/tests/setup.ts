import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/svelte';
import { afterEach, beforeAll } from 'vitest';

/*
 * jsdom does not implement the Web Animations API. Svelte 5's transition
 * runtime calls `element.animate(...)` for declarative transitions. We
 * stub it to a no-op that returns the minimal Animation surface Svelte
 * touches (cancel, finish, finished promise, addEventListener for
 * 'finish' / 'cancel'). Tests that need to assert transition completion
 * should advance timers manually or use the post-transition DOM state.
 *
 * jsdom does not implement layout either. `offsetParent` returns null
 * for every element. We stub it to return the parent element when the
 * node is in the document, which is good enough for the
 * "is this element visible?" heuristic in `getFocusableElements`.
 */
beforeAll(() => {
    // Force all transitions to 0 duration in jsdom so {#if} blocks unmount
    // synchronously when state flips. Without this, outro transitions on
    // accordion/collapsible/sheet keep the element in the DOM until Svelte
    // thinks the animation is done -- and jsdom can't drive that timeline
    // reliably even with the Element.animate stub below.
    if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.textContent = `
			:root {
				--motion-duration-hover: 0ms;
				--motion-duration-menu: 0ms;
				--motion-duration-panel: 0ms;
				--motion-duration-sheet: 0ms;
				--motion-duration-sheet-out: 0ms;
				--motion-duration-overlay: 0ms;
				--motion-duration-tooltip: 0ms;
				--motion-duration-toast-in: 0ms;
				--motion-duration-toast-out: 0ms;
				--motion-duration-press: 0ms;
			}
		`;
        document.head.appendChild(style);
    }

    if (typeof globalThis.ResizeObserver === 'undefined') {
        globalThis.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    }

    if (!('animate' in Element.prototype)) {
        Object.defineProperty(Element.prototype, 'animate', {
            configurable: true,
            value: () => {
                const noop = () => undefined;
                const animation = {
                    cancel: noop,
                    finish: noop,
                    play: noop,
                    pause: noop,
                    reverse: noop,
                    currentTime: 0,
                    playState: 'finished',
                    addEventListener: noop,
                    removeEventListener: noop,
                    dispatchEvent: () => true
                } as unknown as Animation;
                (animation as unknown as { finished: Promise<Animation> }).finished =
                    Promise.resolve(animation);
                return animation;
            }
        });
    }

    try {
        Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
            configurable: true,
            get(this: HTMLElement): Element | null {
                let node: Node | null = this.parentNode;
                while (node && node.nodeType !== 9) {
                    node = node.parentNode;
                }
                return node ? this.parentElement : null;
            }
        });
    } catch {
        // jsdom may define offsetParent non-configurably; tests fall back to
        // patching locally if so.
    }
});

afterEach(() => {
    cleanup();
});

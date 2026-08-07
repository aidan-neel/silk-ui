import type { FullscreenNavState } from '.';
export type FullscreenNavContext = {
    id: string;
    state: FullscreenNavState;
};
declare const setFullscreenNavContext: (value: FullscreenNavContext) => FullscreenNavContext,
    getFullscreenNavContext: () => FullscreenNavContext;
export { setFullscreenNavContext, getFullscreenNavContext };

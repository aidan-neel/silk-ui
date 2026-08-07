import { createContext } from '@sivir-ui/svelte/utils';
const { set: setFullscreenNavContext, get: getFullscreenNavContext } =
    createContext('fullscreen-nav');
export { setFullscreenNavContext, getFullscreenNavContext };

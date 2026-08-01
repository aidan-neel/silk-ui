import { createContext } from '@sivir-ui/svelte/utils';
const { set: setContextMenuContext, get: getContextMenuContext } = createContext('context-menu');
export { setContextMenuContext, getContextMenuContext };

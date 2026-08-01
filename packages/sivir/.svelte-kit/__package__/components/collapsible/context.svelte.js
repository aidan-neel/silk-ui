import { createContext } from '@sivir-ui/svelte/utils';
const { set: setCollapsibleContext, get: getCollapsibleContext } = createContext('collapsible');
export { setCollapsibleContext, getCollapsibleContext };

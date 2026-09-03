import { createContext } from '@sivir-ui/svelte/utils';
const { set: setPopoverContext, get: getPopoverContext } = createContext('popover');
export { getPopoverContext, setPopoverContext };

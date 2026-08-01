import { createContext } from '@sivir-ui/svelte/utils';
const { set: setDropdownMenuContext, get: getDropdownMenuContext } = createContext('dropdown-menu');
export { setDropdownMenuContext, getDropdownMenuContext };

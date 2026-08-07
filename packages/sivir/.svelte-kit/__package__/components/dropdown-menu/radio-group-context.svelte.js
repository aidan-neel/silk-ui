import { createContext } from '@sivir-ui/svelte/utils';
const { set: setDropdownMenuRadioGroupContext, get: getDropdownMenuRadioGroupContext } = createContext('dropdown-menu-radio-group');
export { getDropdownMenuRadioGroupContext, setDropdownMenuRadioGroupContext };

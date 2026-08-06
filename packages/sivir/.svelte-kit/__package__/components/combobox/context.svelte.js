import { createContext } from '@sivir-ui/svelte/utils';
const { set: setComboboxContext, get: getComboboxContext } = createContext('combobox');
export { getComboboxContext, setComboboxContext };

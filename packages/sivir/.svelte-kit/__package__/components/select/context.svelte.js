import { createContext } from '@sivir-ui/svelte/utils';
const { set: setSelectContext, get: getSelectContext } = createContext('select');
export { setSelectContext, getSelectContext };

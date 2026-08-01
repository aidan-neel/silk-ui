import { createContext } from '@sivir-ui/svelte/utils';
const { set: setModalContext, get: getModalContext } = createContext('modal');
export { setModalContext, getModalContext };

import { createContext } from '@sivir-ui/svelte/utils';
const { set: setMessageContext, get: getMessageContext } = createContext('message');
export { getMessageContext, setMessageContext };

import { createContext } from '@sivir-ui/svelte/utils';
const { set: setConversationContext, get: getConversationContext } = createContext('conversation');
export { getConversationContext, setConversationContext };

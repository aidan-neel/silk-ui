import { createContext } from '@sivir-ui/svelte/utils';
const { set: setAttachmentContext, get: getAttachmentContext } = createContext('attachment');
export { setAttachmentContext, getAttachmentContext };

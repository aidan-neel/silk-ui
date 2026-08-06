import { createContext } from '@sivir-ui/svelte/utils';
const { set: setPromptComposerContext, get: getPromptComposerContext } = createContext('prompt-composer');
export { getPromptComposerContext, setPromptComposerContext };

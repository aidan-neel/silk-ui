import { createContext } from '@sivir-ui/svelte/utils';
const { set: setQuestionContext, get: getQuestionContext } = createContext('question');
export { getQuestionContext, setQuestionContext };

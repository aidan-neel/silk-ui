import { createContext } from '@sivir-ui/svelte/utils';
const { set: setApprovalRequestContext, get: getApprovalRequestContext } = createContext('approval-request');
export { getApprovalRequestContext, setApprovalRequestContext };

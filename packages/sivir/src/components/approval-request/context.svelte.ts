import { createContext } from '@sivir-ui/svelte/utils';
import type { ApprovalRisk } from '.';

export type ApprovalRequestContext = {
	get risk(): ApprovalRisk;
};

const { set: setApprovalRequestContext, get: getApprovalRequestContext } =
	createContext<ApprovalRequestContext>('approval-request');

export { getApprovalRequestContext, setApprovalRequestContext };

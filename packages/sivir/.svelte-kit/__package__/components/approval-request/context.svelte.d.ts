import type { ApprovalRisk } from '.';
export type ApprovalRequestContext = {
    get risk(): ApprovalRisk;
};
declare const setApprovalRequestContext: (value: ApprovalRequestContext) => ApprovalRequestContext, getApprovalRequestContext: () => ApprovalRequestContext;
export { getApprovalRequestContext, setApprovalRequestContext };

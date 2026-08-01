import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { DefaultProps } from '@sivir-ui/svelte/utils';
import Root from './approval-request.svelte';
import Content from './approval-request-content.svelte';
import Header from './approval-request-header.svelte';
import Status from './approval-request-status.svelte';
import Icon from './approval-request-icon.svelte';
import Risk from './approval-request-risk.svelte';
import Title from './approval-request-title.svelte';
import Description from './approval-request-description.svelte';
import Details from './approval-request-details.svelte';
import Footer from './approval-request-footer.svelte';
import Cancel from './approval-request-cancel.svelte';
import Confirm from './approval-request-confirm.svelte';
export type ApprovalRisk = 'low' | 'medium' | 'high';
export type ApprovalRequestRootProps = {
    /** Controls modal visibility. Cancel and Confirm close it automatically. */
    open?: boolean;
    risk?: ApprovalRisk;
    children?: Snippet;
};
export type ApprovalRequestContentProps = DefaultProps & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>;
export type ApprovalRequestHeaderProps = DefaultProps & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
export type ApprovalRequestStatusProps = ApprovalRequestHeaderProps;
export type ApprovalRequestIconProps = ApprovalRequestHeaderProps;
export type ApprovalRequestRiskProps = ApprovalRequestHeaderProps;
export type ApprovalRequestTitleProps = DefaultProps;
export type ApprovalRequestDescriptionProps = DefaultProps;
export type ApprovalRequestDetailsProps = ApprovalRequestHeaderProps;
export type ApprovalRequestFooterProps = ApprovalRequestHeaderProps;
export type ApprovalRequestActionProps = {
    onclick?: () => void;
    children?: Snippet;
} & DefaultProps & Omit<HTMLButtonAttributes, 'children' | 'onclick'>;
export { Root, Content, Header, Status, Icon, Risk, Title, Description, Details, Footer, Cancel, Confirm };

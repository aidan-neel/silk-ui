import type { Snippet } from 'svelte';
import type {
    HTMLAttributes,
    HTMLButtonAttributes,
    HTMLFormAttributes,
    HTMLInputAttributes,
    HTMLTextareaAttributes
} from 'svelte/elements';
import Root from './question.svelte';
import Actions from './question-actions.svelte';
import Cancel from './question-cancel.svelte';
import Description from './question-description.svelte';
import Input from './question-input.svelte';
import Option from './question-option.svelte';
import Options from './question-options.svelte';
import Submit from './question-submit.svelte';
import Title from './question-title.svelte';
export type QuestionType = 'single' | 'multiple' | 'text';
export type QuestionAnswer = string | string[];
export type QuestionStatus = 'idle' | 'submitting' | 'error';
export type QuestionProps = {
    type?: QuestionType;
    value?: QuestionAnswer;
    status?: QuestionStatus;
    disabled?: boolean;
    required?: boolean;
    autofocus?: boolean;
    name?: string;
    errorMessage?: string;
    onSubmit: (answer: QuestionAnswer, event: SubmitEvent) => void | Promise<void>;
    onCancel?: (event: MouseEvent) => void;
    class?: string;
    children?: Snippet;
} & Omit<
    HTMLFormAttributes,
    'children' | 'class' | 'onsubmit' | 'action' | 'method' | 'target' | 'enctype' | 'name'
>;
export type QuestionTitleProps = {
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLLegendElement>, 'children' | 'class'>;
export type QuestionDescriptionProps = {
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLParagraphElement>, 'children' | 'class'>;
export type QuestionOptionsProps = {
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;
export type QuestionOptionProps = {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
    element?: HTMLInputElement;
    class?: string;
} & Omit<
    HTMLInputAttributes,
    'type' | 'value' | 'name' | 'checked' | 'disabled' | 'children' | 'class'
>;
export type QuestionInputProps = {
    submitOnEnter?: boolean;
    autoresize?: boolean;
    placeholder?: string;
    'aria-label'?: string;
    rows?: number;
    disabled?: boolean;
    readonly?: boolean;
    element?: HTMLTextAreaElement;
    class?: string;
} & Omit<
    HTMLTextareaAttributes,
    | 'children'
    | 'class'
    | 'value'
    | 'name'
    | 'placeholder'
    | 'aria-label'
    | 'rows'
    | 'disabled'
    | 'readonly'
>;
export type QuestionActionsProps = {
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;
export type QuestionActionProps = {
    children?: Snippet;
    onclick?: (event: MouseEvent) => void;
} & Omit<HTMLButtonAttributes, 'children' | 'onclick' | 'type'>;
export type QuestionSubmitProps = {
    label?: string;
    loadingLabel?: string;
    children?: Snippet;
    element?: HTMLButtonElement | HTMLAnchorElement;
} & Omit<HTMLButtonAttributes, 'children' | 'type'>;
export { Actions, Cancel, Description, Input, Option, Options, Root, Submit, Title };

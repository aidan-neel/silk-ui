import type { QuestionAnswer, QuestionStatus, QuestionType } from '.';
export type QuestionContext = {
    readonly type: QuestionType;
    readonly answer: QuestionAnswer;
    readonly status: QuestionStatus;
    readonly disabled: boolean;
    readonly busy: boolean;
    readonly required: boolean;
    readonly canSubmit: boolean;
    readonly validationMessage: string;
    readonly name: string;
    isSelected: (value: string) => boolean;
    select: (value: string) => void;
    setText: (value: string) => void;
    submit: () => void;
    cancel: (event: MouseEvent) => void;
};
declare const setQuestionContext: (value: QuestionContext) => QuestionContext, getQuestionContext: () => QuestionContext;
export { getQuestionContext, setQuestionContext };

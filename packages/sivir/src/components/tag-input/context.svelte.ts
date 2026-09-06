import { createContext } from '@sivir-ui/svelte/utils';

export type TagInputContext = {
    readonly tags: string[];
    readonly disabled: boolean;
    readonly inputId: string;
    readonly describedBy: string | undefined;
    readonly draft: string;
    readonly atMax: boolean;
    readonly delimiters: string[];
    readonly addOnBlur: boolean;
    readonly addOnPaste: boolean;
    setDraft: (next: string) => void;
    setInputElement: (element: HTMLInputElement | undefined) => void;
    focusInput: () => void;
    add: (raw: string) => boolean;
    commitDraft: () => boolean;
    removeAt: (index: number) => void;
    removeValue: (value: string) => void;
};

const { get: getTagInputContext, set: setTagInputContext } =
    createContext<TagInputContext>('tag-input');

export { getTagInputContext, setTagInputContext };

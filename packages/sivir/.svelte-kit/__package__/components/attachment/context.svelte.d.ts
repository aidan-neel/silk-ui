export type AttachmentContext = {
    files: File[];
    readonly disabled: boolean;
    open: () => void;
    remove: (file: File) => void;
};
declare const setAttachmentContext: (value: AttachmentContext) => AttachmentContext,
    getAttachmentContext: () => AttachmentContext;
export { setAttachmentContext, getAttachmentContext };

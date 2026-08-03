export type ApiReferenceControl = 'toggle' | 'segmented' | 'select' | 'text' | 'number';

export type ApiReferenceItem = {
    property: string;
    type: string;
    description: string;
    defaults?: string;
    control?: ApiReferenceControl;
    options?: string[];
};

interface ImportMeta {
    glob<T = unknown>(pattern: string, options?: { eager?: boolean }): Record<string, T>;
}

declare module '$app/environment' {
    export const browser: boolean;
}

declare module '$app/state' {
    export const page: { readonly url: URL };
}

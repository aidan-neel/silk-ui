/**
 * Highlights `code` for `lang`, returning an HTML string of `hljs-*` token
 * spans. Synchronous (works during SSR). Unknown languages fall back to
 * escaped plain text so nothing ever throws or renders raw markup.
 */
export declare function highlight(code: string, lang?: string): string;

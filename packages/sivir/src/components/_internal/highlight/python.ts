import type { HLJSApi, Language, Mode } from 'highlight.js';
import python from 'highlight.js/lib/languages/python';

/**
 * Stock Python grammar plus function-call titles and operators.
 *
 * highlight.js leaves call names (`Pinecone(…)`, `pc.method(…)`) and
 * operators (`=`, `==`, `*`) unscoped, which reads washed-out next to
 * grammars that scope them. These two appended modes fill the gap; they
 * sit last so keywords, strings, comments, and definitions keep precedence
 * on ties.
 */
export function pythonPlus(hljs: HLJSApi): Language {
    const base = python(hljs);
    const FUNC_CALL: Mode = {
        className: 'title.function',
        begin: /[\p{XID_Start}_]\p{XID_Continue}*(?=\s*\()/u,
        relevance: 0
    };
    const OPERATOR: Mode = {
        className: 'operator',
        begin: /==|!=|<=|>=|:=|->|=|\+|-|\*|\/|%/,
        relevance: 0
    };

    return {
        ...base,
        contains: [...(base.contains ?? []), FUNC_CALL, OPERATOR]
    };
}

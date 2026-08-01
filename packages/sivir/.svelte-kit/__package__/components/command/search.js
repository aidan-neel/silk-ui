import Fuse from 'fuse.js';
export const DEFAULT_COMMAND_SEARCH_THRESHOLD = 0.2;
export function searchCommandItems(items, query, threshold = DEFAULT_COMMAND_SEARCH_THRESHOLD) {
    const q = query.toLowerCase().trim();
    if (!q)
        return [...items];
    const fuseResults = new Fuse(Array.from(items), {
        keys: ['name'],
        threshold,
        ignoreLocation: true,
        minMatchCharLength: 1
    })
        .search(q)
        .map((result) => result.item);
    if (threshold < DEFAULT_COMMAND_SEARCH_THRESHOLD)
        return fuseResults;
    const commandMatches = items.filter((item) => matchesName(item.name, q));
    if (commandMatches.length === 0)
        return fuseResults;
    const commandMatchIds = new Set(commandMatches.map((item) => item.id));
    const results = fuseResults.filter((item) => commandMatchIds.has(item.id));
    const resultIds = new Set(results.map((item) => item.id));
    for (const item of commandMatches) {
        if (!resultIds.has(item.id))
            results.push(item);
    }
    for (const item of fuseResults) {
        if (!commandMatchIds.has(item.id))
            results.push(item);
    }
    return results;
}
function matchesName(name, query) {
    const rawWords = name
        .toLowerCase()
        .split(/[\s-]+/)
        .filter(Boolean);
    const words = [...new Set(rawWords)];
    const terms = query.split(/[\s-]+/).filter(Boolean);
    if (terms.length === 0)
        return false;
    const compactQuery = terms.join('');
    let nextWord = 0;
    for (const term of terms) {
        const matchIndex = findWordMatch(words, term, nextWord);
        if (matchIndex === -1)
            return matchesAcronym(words, compactQuery);
        nextWord = matchIndex + 1;
    }
    return true;
}
function findWordMatch(words, query, startIndex) {
    for (let index = startIndex; index < words.length; index++) {
        if (matchesWord(words[index], query))
            return index;
    }
    return -1;
}
function matchesWord(word, query) {
    if (word.startsWith(query))
        return true;
    if (query.length < 3)
        return false;
    let queryIndex = 0;
    for (const character of word) {
        if (character === query[queryIndex])
            queryIndex++;
    }
    return queryIndex === query.length;
}
function matchesAcronym(words, query) {
    for (let index = 0; index < words.length - 1; index++) {
        if (words[index][0] !== query[0])
            continue;
        if (findWordMatch(words, query.slice(1), index + 1) !== -1)
            return true;
    }
    return false;
}

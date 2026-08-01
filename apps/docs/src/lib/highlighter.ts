import { createHighlighter, type ThemeInput } from 'shiki';
import lightTheme from '$lib/themes/light.json';
import darkTheme from '$lib/themes/dark.json';

export const highlighter = await createHighlighter({
    themes: [lightTheme as unknown as ThemeInput, darkTheme as unknown as ThemeInput],
    langs: ['svelte', 'shell', 'css', 'typescript', 'javascript', 'json', 'html']
});

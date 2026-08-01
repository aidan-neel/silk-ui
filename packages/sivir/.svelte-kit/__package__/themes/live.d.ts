import { type Theme } from './theme';
export type SavedTheme = Theme & {
    id: string;
    savedAt: string;
};
export declare function applyLiveThemeCss(css: string): void;
export declare function hydrateLiveThemeCss(): void;
export declare function getStoredLiveThemeCss(): string | null;
export declare function clearLiveThemeCss(): void;
export declare function saveStudioTheme(theme: Theme): void;
export declare function loadStudioTheme(): Theme | null;
export declare function getSavedThemes(): SavedTheme[];
export declare function saveLocalTheme(theme: Theme, existingId?: string): SavedTheme;
export declare function deleteLocalTheme(id: string): void;

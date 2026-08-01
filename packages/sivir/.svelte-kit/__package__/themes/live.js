import { browser } from '$app/environment';
import { parseTheme } from './theme';
const STORAGE_KEY = 'sivir-live-theme-css';
const STYLE_ID = 'sivir-live-theme-style';
const STUDIO_THEME_KEY = 'sivir-studio-theme-v2';
const SAVED_THEMES_KEY = 'sivir-saved-themes-v2';
const LEGACY_KEYS = ['sivir-theme-studio-state', 'sivir-saved-themes'];
function getStyleTag() {
    if (!browser) {
        return null;
    }
    let tag = document.getElementById(STYLE_ID);
    if (tag) {
        return tag;
    }
    tag = document.createElement('style');
    tag.id = STYLE_ID;
    document.head.appendChild(tag);
    return tag;
}
export function applyLiveThemeCss(css) {
    if (!browser) {
        return;
    }
    const tag = getStyleTag();
    if (!tag) {
        return;
    }
    tag.textContent = css;
    localStorage.setItem(STORAGE_KEY, css);
}
export function hydrateLiveThemeCss() {
    if (!browser) {
        return;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return;
    }
    const tag = getStyleTag();
    if (tag) {
        tag.textContent = stored;
    }
}
export function getStoredLiveThemeCss() {
    return browser ? localStorage.getItem(STORAGE_KEY) : null;
}
export function clearLiveThemeCss() {
    if (!browser) {
        return;
    }
    localStorage.removeItem(STORAGE_KEY);
    document.getElementById(STYLE_ID)?.remove();
}
function randomId() {
    if (browser && typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return `local-${crypto.randomUUID()}`;
    }
    return `local-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
export function saveStudioTheme(theme) {
    if (!browser) {
        return;
    }
    localStorage.setItem(STUDIO_THEME_KEY, JSON.stringify(parseTheme(theme)));
}
export function loadStudioTheme() {
    if (!browser) {
        return null;
    }
    for (const key of LEGACY_KEYS) {
        localStorage.removeItem(key);
    }
    const stored = localStorage.getItem(STUDIO_THEME_KEY);
    if (!stored) {
        return null;
    }
    try {
        return parseTheme(JSON.parse(stored));
    }
    catch {
        localStorage.removeItem(STUDIO_THEME_KEY);
        return null;
    }
}
export function getSavedThemes() {
    if (!browser) {
        return [];
    }
    const stored = localStorage.getItem(SAVED_THEMES_KEY);
    if (!stored) {
        return [];
    }
    try {
        const values = JSON.parse(stored);
        if (!Array.isArray(values)) {
            throw new TypeError('Expected a theme list.');
        }
        return values
            .map((value) => {
            if (typeof value !== 'object' || value === null) {
                throw new TypeError('Invalid theme.');
            }
            const record = value;
            return {
                ...parseTheme(record),
                id: typeof record.id === 'string' ? record.id : randomId(),
                savedAt: typeof record.savedAt === 'string'
                    ? record.savedAt
                    : new Date().toISOString()
            };
        })
            .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    }
    catch {
        localStorage.removeItem(SAVED_THEMES_KEY);
        return [];
    }
}
export function saveLocalTheme(theme, existingId) {
    const entry = {
        ...parseTheme(theme),
        id: existingId ?? randomId(),
        savedAt: new Date().toISOString()
    };
    if (!browser) {
        return entry;
    }
    const next = [entry, ...getSavedThemes().filter((candidate) => candidate.id !== entry.id)];
    localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(next));
    return entry;
}
export function deleteLocalTheme(id) {
    if (!browser) {
        return;
    }
    const next = getSavedThemes().filter((theme) => theme.id !== id);
    localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(next));
}

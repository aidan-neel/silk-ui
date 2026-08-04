<script lang="ts">
import Button from '@sivir-ui/svelte/components/button';
import { mode } from 'mode-watcher';

const { name, css, clicked }: { name: string; css: string; clicked: () => void } = $props();

let background = $state('');
let primary = $state('');
let foreground = $state('');
let border = $state('');

$effect(() => {
    if (!css) return;

    const { background: bg, primary: pr, foreground: fg, border: bordr } = extractThemeVars(css);
    background = bg;
    primary = pr;
    foreground = fg;
    border = bordr;
});

function extractThemeVars(css: string) {
    const result = {
        background: '',
        primary: '',
        foreground: '',
        border: ''
    };

    const isDark = mode.current === 'dark';
    const themeRegex = isDark
        ? /\.dark\s*\{([^}]*)\}/s // <-- no @theme inside dark
        : /@theme\s*{([^}]*)}/s;

    const match = css.match(themeRegex);
    if (!match) return result;

    const body = match[1];

    const get = (varName: string) => {
        const varRegex = new RegExp(`--${varName}\\s*:\\s*([^;]+);`);
        const varMatch = body.match(varRegex);
        return varMatch ? varMatch[1].trim() : '';
    };

    result.background = get('color-background');
    result.primary = get('color-primary');
    result.foreground = get('color-foreground');
    result.border = get('color-border');

    return result;
}

function copyCode() {
    navigator.clipboard.writeText(css);
}
</script>

<button class="flex p-4 border relative rounded-lg flex-col gap-3">
    <h3
        class="text-left text-lg [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-[-0.02em] [font-family:var(--font-header),sans-serif]"
    >
        {name}
    </h3>
    <div class="flex flex-row gap-2">
        <div
            class="h-8 w-full rounded-lg border"
            style={`background:${primary}; border-color:${border};`}
        ></div>
        <div
            class="h-8 w-full rounded-lg border"
            style={`background:${foreground}; border-color:${border};`}
        ></div>
        <div
            class="h-8 w-full rounded-lg border"
            style={`background:${background}; border-color:${border};`}
        ></div>
    </div>
    <div class="flex flex-row gap-3">
        <Button onclick={clicked} variant="primary" class="w-full">Preview</Button>
        <Button onclick={copyCode} variant="outline" class="w-full">Copy Code</Button>
    </div>
</button>

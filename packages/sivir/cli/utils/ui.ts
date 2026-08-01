import pc from 'picocolors';

/** Sivir brand ramp -- primary indigo into the docs-site teal. */
const GRADIENT_FROM: [number, number, number] = [94, 106, 210]; // #5e6ad2
const GRADIENT_TO: [number, number, number] = [45, 212, 191]; // #2dd4bf

function lerp(from: number, to: number, t: number) {
    return Math.round(from + (to - from) * t);
}

/** Colors a single line with a horizontal truecolor gradient. */
export function gradientLine(line: string) {
    if (!pc.isColorSupported) return line;
    const chars = [...line];
    const last = Math.max(chars.length - 1, 1);
    return chars
        .map((char, i) => {
            if (char.trim() === '') return char;
            const t = i / last;
            const r = lerp(GRADIENT_FROM[0], GRADIENT_TO[0], t);
            const g = lerp(GRADIENT_FROM[1], GRADIENT_TO[1], t);
            const b = lerp(GRADIENT_FROM[2], GRADIENT_TO[2], t);
            return `[38;2;${r};${g};${b}m${char}[39m`;
        })
        .join('');
}

export const BANNER = [
    '█████  █  █   █  █  ████ ',
    '█      █  █   █  █  █   █',
    '█████  █  █   █  █  ████ ',
    '    █  █   █ █   █  █  █ ',
    '█████  █    █    █  █   █'
];

/** Prints the sivir banner with tagline. */
export function banner(version: string) {
    console.log();
    for (const line of BANNER) console.log(gradientLine(line));
    console.log();
    console.log(
        `  ${pc.bold('Sivir UI')} ${pc.dim(`v${version}`)} ${pc.dim('·')} ${pc.dim('Svelte components you own')}`
    );
    console.log();
}

export const ok = (message: string) => console.log(`${pc.green('✔')} ${message}`);
export const warn = (message: string) => console.log(`${pc.yellow('▲')} ${message}`);
export const fail = (message: string) => console.error(`${pc.red('✖')} ${message}`);

/** Renders a list of lines as a box-drawing tree under a heading. */
export function tree(heading: string, lines: string[]) {
    console.log(`  ${heading}`);
    lines.forEach((line, i) => {
        const branch = i === lines.length - 1 ? '└─' : '├─';
        console.log(`  ${pc.dim(branch)} ${line}`);
    });
}

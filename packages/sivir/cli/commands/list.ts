import pc from 'picocolors';
import { loadRegistryIndex, loadRegistryThemes } from '../registry';

function truncate(text: string, width: number) {
    return text.length <= width ? text : `${text.slice(0, Math.max(width - 1, 0))}…`;
}

export async function list() {
    const index = await loadRegistryIndex();
    const components = index.components
        .filter((component) => component.visibility === 'public')
        .sort((a, b) => a.name.localeCompare(b.name));

    const nameWidth = Math.max(...components.map((c) => c.name.length));
    const descriptionWidth = Math.max((process.stdout.columns || 100) - nameWidth - 14, 20);

    console.log();
    console.log(`  ${pc.bold(`${components.length} components`)}`);
    console.log();
    for (const component of components) {
        console.log(
            `  ${pc.cyan(component.name.padEnd(nameWidth))}  ${pc.dim(`v${component.version}`.padEnd(7))} ${pc.dim(truncate(component.description ?? '', descriptionWidth))}`
        );
    }

    const themes = await loadRegistryThemes();
    if (themes.length > 0) {
        console.log();
        console.log(`  ${pc.bold(`${themes.length} built-in theme(s)`)}`);
        console.log();
        for (const theme of themes) {
            console.log(`  ${pc.magenta(theme.slug.padEnd(nameWidth))}  ${pc.dim(theme.name)}`);
        }
    }

    console.log();
    console.log(`  ${pc.dim('install with')} ${pc.cyan('sivir add <component>')}`);
    console.log();
}

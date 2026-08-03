import { Command } from 'commander';
import { add } from './commands/add';
import { init } from './commands/init';
import { list } from './commands/list';
import { addTheme } from './commands/theme';
import { banner } from './utils/ui';
import pkg from '../package.json';

const program = new Command('sivir')
    .description('Install Sivir UI components into your Svelte project.')
    .version(pkg.version)
    .option('-C, --cwd <dir>', 'project root to operate in', process.cwd());

program
    .command('init')
    .description('bootstrap sivir.json, theme tokens, and shared utilities')
    .option('-y, --yes', 'accept all defaults without prompting', false)
    .action(async (options: { yes: boolean }) => {
        banner(pkg.version);
        await init({ cwd: program.opts().cwd, yes: options.yes });
    });

program
    .command('add')
    .description('add components (or `add theme <slug>`) to your project')
    .argument('<names...>', 'component names, or `theme <slug>`')
    .option('-y, --yes', 'skip prompts; auto-install missing peer dependencies', false)
    .option('-o, --overwrite', 'replace files that already exist', false)
    .action(async (names: string[], options: { yes: boolean; overwrite: boolean }) => {
        const cwd = program.opts().cwd;
        if (names[0] === 'theme') {
            if (names.length !== 2) {
                program.error('usage: sivir add theme <slug>');
            }
            await addTheme(names[1], { cwd });
            return;
        }
        await add(names, { cwd, yes: options.yes, overwrite: options.overwrite });
    });

program
    .command('list')
    .description('list every installable component and built-in theme')
    .action(async () => {
        banner(pkg.version);
        await list();
    });

program.parseAsync().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});

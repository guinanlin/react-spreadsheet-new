import { Command } from 'commander';
import chalk from 'chalk';
import { init } from './commands/init';
import { add } from './commands/add';

const packageJson = require('../package.json');

const program = new Command();

program
  .name('react-spreadsheet')
  .description('Add React Spreadsheet components to your project')
  .version(packageJson.version);

program
  .command('init')
  .description('Initialize react-spreadsheet configuration in your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('-c, --cwd <path>', 'Working directory (default: current directory)')
  .action(init);

program
  .command('add [components...]')
  .description('Add components to your project')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('-c, --cwd <path>', 'Working directory (default: current directory)')
  .option('-p, --path <path>', 'Custom installation path')
  .action(add);

program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}


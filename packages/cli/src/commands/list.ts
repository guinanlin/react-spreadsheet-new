import chalk from 'chalk';
import ora from 'ora';
import { fetchRegistry } from '../utils/registry';

export async function list() {
  const spinner = ora('获取可用组件...').start();

  try {
    const registry = await fetchRegistry();
    const components = Object.values(registry.components);
    const total = components.length;

    spinner.succeed(`可用组件（共 ${total} 个）`);
    console.log('');

    components
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((component) => {
        console.log(
          chalk.cyan(`  ${component.name}`) +
            chalk.dim(` - ${component.description}`)
        );
      });

    console.log('');
    console.log(chalk.dim('安装:'));
    console.log(
      chalk.dim('  npx @goodhawk/react-spreadsheet-cli add <component-name>')
    );
    console.log('');
  } catch (error) {
    spinner.fail('获取组件列表失败');
    console.error(chalk.red(error));
    process.exit(1);
  }
}

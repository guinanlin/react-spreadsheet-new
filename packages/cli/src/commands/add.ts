import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { fetchRegistry, fetchComponent } from '../utils/registry';
import { installDependencies, detectPackageManager } from '../utils/package-manager';

interface AddOptions {
  overwrite?: boolean;
  cwd?: string;
  path?: string;
}

const CONFIG_FILE = 'react-spreadsheet.json';

export async function add(components: string[], options: AddOptions) {
  const cwd = options.cwd || process.cwd();
  const configPath = path.join(cwd, CONFIG_FILE);

  // 读取配置文件
  let config: any;
  if (await fs.pathExists(configPath)) {
    config = await fs.readJson(configPath);
  } else {
    console.log(chalk.yellow('\n⚠️  未找到配置文件，使用默认配置'));
    console.log(chalk.dim('提示: 运行 `npx @goodhawk/react-spreadsheet-cli init` 创建配置文件\n'));
    config = {
      components: { path: 'components/ui' },
      aliases: { components: '@/components' },
    };
  }

  // 如果没有指定组件，交互式选择
  if (!components || components.length === 0) {
    const spinner = ora('获取可用组件...').start();

    let registry: any;
    try {
      registry = await fetchRegistry();
      spinner.stop();
    } catch (error) {
      spinner.fail('获取组件列表失败');
      console.error(chalk.red(error));
      process.exit(1);
    }

    const componentList = Object.values(registry.components) as any[];

    const { selected } = await prompts({
      type: 'multiselect',
      name: 'selected',
      message: '选择要安装的组件（空格选择，回车确认）',
      choices: componentList
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({
          title: chalk.cyan(c.name) + chalk.dim(` - ${c.description}`),
          value: c.name,
        })),
      min: 1,
    });

    if (!selected || selected.length === 0) {
      console.log(chalk.yellow('\n未选择任何组件，已退出。\n'));
      return;
    }

    components = selected;
  }

  console.log(chalk.bold(`\n📦 安装组件: ${components.join(', ')}\n`));

  const spinner = ora('获取组件注册表...').start();

  try {
    const registry = await fetchRegistry();
    spinner.succeed('组件注册表已获取');

    // 验证所有组件是否存在
    const invalidComponents = components.filter(
      (name) => !registry.components[name]
    );

    if (invalidComponents.length > 0) {
      console.error(
        chalk.red(`\n错误: 组件不存在: ${invalidComponents.join(', ')}`)
      );
      console.log(chalk.dim('\n运行 `npx @goodhawk/react-spreadsheet-cli add` 查看可用组件'));
      process.exit(1);
    }

    // 安装每个组件
    const allDependencies = new Set<string>();

    for (const componentName of components) {
      await installComponent(
        componentName,
        registry.components[componentName],
        config,
        cwd,
        options,
        allDependencies
      );
    }

    // 安装依赖
    if (allDependencies.size > 0) {
      const depSpinner = ora('安装依赖...').start();
      try {
        const pm = await detectPackageManager(cwd);
        await installDependencies(Array.from(allDependencies), cwd, pm);
        depSpinner.succeed('依赖安装完成');
      } catch (error) {
        depSpinner.warn('依赖安装失败，请手动安装');
        console.log(chalk.yellow('\n请手动运行:'));
        console.log(chalk.cyan(`  npm install ${Array.from(allDependencies).join(' ')}\n`));
      }
    }

    console.log(chalk.green('\n✓ 组件安装完成！\n'));
    console.log('使用方法:');
    components.forEach((name) => {
      const component = registry.components[name];
      const importPath = config.aliases.components || '@/components';
      console.log(chalk.cyan(`  import { ${toPascalCase(name)} } from '${importPath}/ui/${name}';`));
    });
    console.log('');
  } catch (error) {
    spinner.fail('安装失败');
    console.error(chalk.red('\n错误：'), error);
    process.exit(1);
  }
}

async function installComponent(
  name: string,
  component: any,
  config: any,
  cwd: string,
  options: AddOptions,
  dependencies: Set<string>
) {
  const spinner = ora(`安装 ${name}...`).start();

  try {
    // 确定安装路径（--path 为绝对路径时直接使用，否则相对 cwd 拼接）
    const installBase = options.path
      ? path.isAbsolute(options.path)
        ? options.path
        : path.join(cwd, options.path)
      : path.join(cwd, config.components.path);
    const targetDir = path.join(installBase, name);

    // 检查是否已存在
    if (await fs.pathExists(targetDir)) {
      if (!options.overwrite) {
        spinner.warn(`${name} 已存在`);
        
        const { overwrite } = await prompts({
          type: 'confirm',
          name: 'overwrite',
          message: `${name} 已存在，是否覆盖？`,
          initial: false,
        });

        if (!overwrite) {
          spinner.info(`跳过 ${name}`);
          return;
        }
      }
    }

    // 确保目录存在
    await fs.ensureDir(targetDir);

    // 下载组件文件
    const files = await fetchComponent(name);

    // 写入文件
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(targetDir, filePath);
      await fs.ensureDir(path.dirname(fullPath));
      await fs.writeFile(fullPath, content as string, 'utf-8');
    }

    // 收集依赖
    if (component.dependencies) {
      component.dependencies.forEach((dep: string) => dependencies.add(dep));
    }

    spinner.succeed(`${name} 已安装`);
  } catch (error) {
    spinner.fail(`${name} 安装失败`);
    throw error;
  }
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}


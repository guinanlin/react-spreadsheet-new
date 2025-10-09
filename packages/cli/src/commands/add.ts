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
      components: { path: 'src/components/ui' },
      aliases: { components: '@/components' },
    };
  }

  // 如果没有指定组件，显示可用组件列表
  if (!components || components.length === 0) {
    const spinner = ora('获取可用组件...').start();
    
    try {
      const registry = await fetchRegistry();
      spinner.succeed('可用组件：');

      console.log('');
      Object.values(registry.components).forEach((component: any) => {
        console.log(chalk.cyan(`  ${component.name}`) + chalk.dim(` - ${component.description}`));
      });
      console.log('');
      console.log(chalk.dim('使用方法:'));
      console.log(chalk.dim('  npx @goodhawk/react-spreadsheet-cli add <component-name>'));
      console.log('');
      
      return;
    } catch (error) {
      spinner.fail('获取组件列表失败');
      console.error(chalk.red(error));
      process.exit(1);
    }
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
    // 确定安装路径
    const targetDir = path.join(
      cwd,
      options.path || config.components.path,
      name
    );

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


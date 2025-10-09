import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';

interface InitOptions {
  yes?: boolean;
  cwd?: string;
}

const CONFIG_FILE = 'react-spreadsheet.json';

const DEFAULT_CONFIG = {
  $schema: 'https://react-spreadsheet.dev/schema.json',
  style: 'default',
  components: {
    path: 'components/ui',
  },
  aliases: {
    components: '@/components',
    utils: '@/lib/utils',
  },
};

export async function init(options: InitOptions) {
  const cwd = options.cwd || process.cwd();
  const configPath = path.join(cwd, CONFIG_FILE);

  console.log(chalk.bold('\n🚀 初始化 React Spreadsheet\n'));

  // 检查是否已存在配置文件
  if (await fs.pathExists(configPath)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `配置文件 ${CONFIG_FILE} 已存在，是否覆盖？`,
      initial: false,
    });

    if (!overwrite) {
      console.log(chalk.yellow('\n取消初始化。'));
      return;
    }
  }

  let config = { ...DEFAULT_CONFIG };

  if (!options.yes) {
    // 询问用户配置
    const responses = await prompts([
      {
        type: 'text',
        name: 'componentsPath',
        message: '组件安装路径？',
        initial: DEFAULT_CONFIG.components.path,
      },
      {
        type: 'text',
        name: 'componentsAlias',
        message: '组件导入别名？',
        initial: DEFAULT_CONFIG.aliases.components,
      },
    ]);

    if (responses.componentsPath) {
      config.components.path = responses.componentsPath;
    }
    if (responses.componentsAlias) {
      config.aliases.components = responses.componentsAlias;
    }
  }

  const spinner = ora('创建配置文件...').start();

  try {
    // 写入配置文件
    await fs.writeJson(configPath, config, { spaces: 2 });

    // 确保组件目录存在
    const componentsDir = path.join(cwd, config.components.path);
    await fs.ensureDir(componentsDir);

    spinner.succeed('配置文件创建成功！');

    console.log(chalk.green('\n✓ 初始化完成！\n'));
    console.log('下一步：');
    console.log(chalk.cyan('  npx @goodhawk/react-spreadsheet-cli add spreadsheet'));
    console.log(chalk.cyan('  npx @goodhawk/react-spreadsheet-cli add pivot-table\n'));
  } catch (error) {
    spinner.fail('初始化失败');
    console.error(chalk.red('\n错误：'), error);
    process.exit(1);
  }
}


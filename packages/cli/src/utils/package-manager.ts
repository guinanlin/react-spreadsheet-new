const { execa } = require('execa');
import fs from 'fs-extra';
import path from 'path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

/**
 * 检测项目使用的包管理器
 */
export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  // 检查 lock 文件
  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }
  
  if (await fs.pathExists(path.join(cwd, 'package-lock.json'))) {
    return 'npm';
  }

  // 默认使用 npm
  return 'npm';
}

/**
 * 安装依赖包
 */
export async function installDependencies(
  dependencies: string[],
  cwd: string,
  packageManager: PackageManager = 'npm'
): Promise<void> {
  if (dependencies.length === 0) {
    return;
  }

  const commands: Record<PackageManager, { command: string; args: string[] }> = {
    npm: {
      command: 'npm',
      args: ['install', ...dependencies],
    },
    pnpm: {
      command: 'pnpm',
      args: ['add', ...dependencies],
    },
    yarn: {
      command: 'yarn',
      args: ['add', ...dependencies],
    },
  };

  const { command, args } = commands[packageManager];

  await execa(command, args, {
    cwd,
    stdio: 'inherit',
  });
}


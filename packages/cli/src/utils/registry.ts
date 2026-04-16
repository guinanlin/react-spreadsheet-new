import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs-extra';

const REGISTRY_URL = 'https://raw.githubusercontent.com/guinanlin/react-spreadsheet-new/dty/packages/components/registry.json';
const COMPONENT_BASE_URL = 'https://raw.githubusercontent.com/guinanlin/react-spreadsheet-new/dty/packages/components';

export interface Registry {
  components: {
    [key: string]: {
      name: string;
      description: string;
      type: string;
      files: string[];
      dependencies: string[];
    };
  };
}

/**
 * 获取组件注册表
 * 优先从本地获取（开发模式），否则从 GitHub 获取
 */
export async function fetchRegistry(): Promise<Registry> {
  // 尝试从本地获取（开发模式）
  const localRegistryPath = path.join(__dirname, '../../../../components/registry.json');
  
  if (await fs.pathExists(localRegistryPath)) {
    return await fs.readJson(localRegistryPath);
  }

  // 从 GitHub 获取
  try {
    const response = await fetch(REGISTRY_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as Registry;
  } catch (error) {
    throw new Error(`无法获取组件注册表: ${error}`);
  }
}

/**
 * 获取组件的所有文件
 */
export async function fetchComponent(name: string): Promise<Record<string, string>> {
  const registry = await fetchRegistry();
  const component = registry.components[name];

  if (!component) {
    throw new Error(`组件 "${name}" 不存在`);
  }

  const files: Record<string, string> = {};

  // 尝试从本地获取（开发模式）
  const localComponentPath = path.join(__dirname, '../../../../components', name);
  
  if (await fs.pathExists(localComponentPath)) {
    // 本地模式：直接读取文件
    for (const file of component.files) {
      const filePath = path.join(localComponentPath, file);
      if (await fs.pathExists(filePath)) {
        files[file] = await fs.readFile(filePath, 'utf-8');
      }
    }
  } else {
    // 远程模式：从 GitHub 下载
    await Promise.all(
      component.files.map(async (file) => {
        const url = `${COMPONENT_BASE_URL}/${name}/${file}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`无法下载 ${file}: HTTP ${response.status}`);
        }
        
        files[file] = await response.text();
      })
    );
  }

  return files;
}


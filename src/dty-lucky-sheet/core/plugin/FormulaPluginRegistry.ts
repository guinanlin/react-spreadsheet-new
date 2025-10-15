/**
 * 公式插件注册中心
 * 单例模式，全局管理所有插件的注册、卸载和函数绑定
 */

import { FormulaPlugin, PluginFunction } from './types';
import type { Context } from '../context';

/**
 * 插件注册管理器类
 */
export class FormulaPluginRegistry {
  private static instance: FormulaPluginRegistry;
  
  /** 已注册的插件 Map（key: pluginId, value: plugin） */
  private plugins: Map<string, FormulaPlugin> = new Map();
  
  /** 已注册的函数 Map（key: functionName（大写）, value: PluginFunction） */
  private functions: Map<string, PluginFunction> = new Map();
  
  /** 是否已绑定到 Parser */
  private initialized: boolean = false;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): FormulaPluginRegistry {
    if (!FormulaPluginRegistry.instance) {
      FormulaPluginRegistry.instance = new FormulaPluginRegistry();
    }
    return FormulaPluginRegistry.instance;
  }

  /**
   * 注册单个插件
   * @param plugin - 要注册的插件
   */
  async registerPlugin(plugin: FormulaPlugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      console.warn(`⚠️ 插件 "${plugin.id}" 已存在，将被覆盖`);
    }

    // 调用插件初始化
    if (plugin.initialize) {
      try {
        await plugin.initialize();
        console.log(`✅ 插件 "${plugin.name}" 初始化成功`);
      } catch (error) {
        console.error(`❌ 插件 "${plugin.name}" 初始化失败:`, error);
        throw error;
      }
    }

    // 注册插件提供的所有函数
    plugin.functions.forEach(func => {
      const funcName = func.name.toUpperCase();
      
      if (this.functions.has(funcName)) {
        console.warn(`⚠️ 函数 "${funcName}" 已存在，将被覆盖`);
      }
      
      this.functions.set(funcName, {
        ...func,
        name: funcName
      });
      
      console.log(`  📌 注册函数: ${funcName}`);
    });

    this.plugins.set(plugin.id, plugin);
    console.log(`✅ 插件 "${plugin.name}" (${plugin.id}) 注册成功`);
  }

  /**
   * 批量注册插件
   * @param plugins - 插件数组
   */
  async registerPlugins(plugins: FormulaPlugin[]): Promise<void> {
    for (const plugin of plugins) {
      await this.registerPlugin(plugin);
    }
  }

  /**
   * 卸载插件
   * @param pluginId - 插件ID
   */
  unregisterPlugin(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    
    if (!plugin) {
      console.warn(`⚠️ 插件 "${pluginId}" 不存在`);
      return;
    }

    // 移除插件的所有函数
    plugin.functions.forEach(func => {
      this.functions.delete(func.name.toUpperCase());
    });

    // 调用插件清理
    if (plugin.destroy) {
      plugin.destroy();
    }

    this.plugins.delete(pluginId);
    console.log(`✅ 插件 "${plugin.name}" 已卸载`);
  }

  /**
   * 获取函数定义
   * @param name - 函数名（不区分大小写）
   * @returns 函数定义，如果不存在返回 undefined
   */
  getFunction(name: string): PluginFunction | undefined {
    return this.functions.get(name.toUpperCase());
  }

  /**
   * 获取所有已注册的函数名
   * @returns 函数名数组
   */
  getAllFunctionNames(): string[] {
    return Array.from(this.functions.keys());
  }

  /**
   * 获取所有已注册的插件
   * @returns 插件数组
   */
  getAllPlugins(): FormulaPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 将插件函数绑定到 Parser
   * 这是连接插件系统和公式解析器的桥梁
   * @param ctx - 上下文对象
   */
  bindToParser(ctx: Context): void {
    if (this.initialized) {
      console.warn('⚠️ 插件已绑定到 Parser，跳过重复绑定');
      return;
    }

    const parser = ctx.formulaCache.parser;
    
    // 遍历所有注册的函数，绑定到 Parser
    this.functions.forEach((func, funcName) => {
      parser.setFunction(funcName, (args: any[]) => {
        try {
          // 构建上下文
          const context = {
            sheetId: ctx.currentSheetId,
            // 可以从 parser 上下文获取更多信息
          };
          
          // 执行插件函数
          const result = func.execute(args, context);
          
          return result;
        } catch (error: any) {
          console.error(`❌ 函数 ${funcName} 执行失败:`, error);
          return '#ERROR!';
        }
      });
    });

    this.initialized = true;
    console.log(`✅ 已将 ${this.functions.size} 个插件函数绑定到 Parser`);
  }

  /**
   * 重置注册表
   * 卸载所有插件并清空状态
   */
  reset(): void {
    this.plugins.forEach(plugin => {
      if (plugin.destroy) {
        plugin.destroy();
      }
    });
    
    this.plugins.clear();
    this.functions.clear();
    this.initialized = false;
    
    console.log('🔄 插件注册表已重置');
  }

  /**
   * 获取插件统计信息
   * @returns 统计信息对象
   */
  getStats() {
    return {
      pluginCount: this.plugins.size,
      functionCount: this.functions.size,
      initialized: this.initialized,
      plugins: Array.from(this.plugins.values()).map(p => ({
        id: p.id,
        name: p.name,
        version: p.version,
        functionCount: p.functions.length,
      })),
    };
  }
}

/**
 * 导出单例实例
 * 使用方式：
 * ```typescript
 * import { formulaPluginRegistry } from './FormulaPluginRegistry';
 * await formulaPluginRegistry.registerPlugin(myPlugin);
 * ```
 */
export const formulaPluginRegistry = FormulaPluginRegistry.getInstance();


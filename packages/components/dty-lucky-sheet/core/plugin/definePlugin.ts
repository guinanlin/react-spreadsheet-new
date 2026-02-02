/**
 * 插件定义工具
 * 提供简化的插件创建和自动注册功能
 */

import { FormulaPlugin } from './types';

/**
 * 定义并自动注册插件
 * 
 * 插件在被 import 时会自动加入待注册队列
 * Workbook 组件初始化时会自动注册所有待注册的插件
 * 
 * @param plugin - 插件定义
 * @returns 原始插件对象（便于导出）
 * 
 * @example
 * ```typescript
 * export const MyPlugin = definePlugin({
 *   id: 'my-plugin',
 *   name: 'My Plugin',
 *   version: '1.0.0',
 *   functions: [...]
 * });
 * ```
 */
export function definePlugin(plugin: FormulaPlugin): FormulaPlugin {
  // 在浏览器环境中，将插件加入待注册队列
  if (typeof window !== 'undefined') {
    // 初始化待注册队列
    if (!window.__PENDING_PLUGINS__) {
      window.__PENDING_PLUGINS__ = [];
    }
    
    // 加入队列
    window.__PENDING_PLUGINS__.push(plugin);
    
    console.log(`📦 插件 "${plugin.name}" 已加载，等待自动注册`);
  }
  
  return plugin;
}

/**
 * 创建插件（简化版语法糖）
 * 
 * 提供更简洁的插件创建方式，自动填充默认值
 * 
 * @param config - 插件配置（简化版）
 * @returns 插件对象
 * 
 * @example
 * ```typescript
 * export const MyPlugin = createPlugin({
 *   id: 'my-plugin',
 *   name: 'My Plugin',
 *   functions: [
 *     {
 *       name: 'MY_FUNC',
 *       execute: (args) => args[0] * 2
 *     }
 *   ]
 * });
 * ```
 */
export function createPlugin(config: {
  /** 插件唯一标识 */
  id: string;
  
  /** 插件名称 */
  name: string;
  
  /** 插件版本（默认 "1.0.0"） */
  version?: string;
  
  /** 插件作者 */
  author?: string;
  
  /** 插件描述 */
  description?: string;
  
  /** 函数列表 */
  functions: FormulaPlugin['functions'];
  
  /** 初始化函数 */
  initialize?: FormulaPlugin['initialize'];
  
  /** 清理函数 */
  destroy?: FormulaPlugin['destroy'];
  
  /** 服务配置 */
  serviceConfig?: FormulaPlugin['serviceConfig'];
}): FormulaPlugin {
  const plugin: FormulaPlugin = {
    version: '1.0.0',
    ...config,
  };
  
  return definePlugin(plugin);
}


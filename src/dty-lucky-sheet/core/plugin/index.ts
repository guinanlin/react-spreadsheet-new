/**
 * 插件系统入口
 * 导出所有插件相关的类型和工具
 */

// 类型定义
export type {
  FormulaPlugin,
  PluginFunction,
  FormulaContext,
  FunctionParam,
  PluginServiceConfig,
} from './types';

// 插件注册管理器
export {
  FormulaPluginRegistry,
  formulaPluginRegistry,
} from './FormulaPluginRegistry';

// 插件定义工具
export { definePlugin, createPlugin } from './definePlugin';


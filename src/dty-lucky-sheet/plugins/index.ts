/**
 * 插件入口文件
 * 
 * 统一导出所有示例插件
 * 使用时可以选择性导入，或者一次性导入所有插件
 */

// 导出插件定义（便于单独使用）
export { ExampleBasicPlugin } from './example-basic';
export { ExampleAPIPlugin } from './example-api';

// 自动注册模式：导入此文件即可加载所有示例插件
// 如果不想自动注册，请不要导入此文件，而是导入具体的插件文件
import './example-basic';
import './example-api';

/**
 * 使用方式 1：自动注册所有示例插件
 * ```typescript
 * import './plugins';  // 导入即自动注册
 * ```
 * 
 * 使用方式 2：选择性注册
 * ```typescript
 * import './plugins/example-basic';  // 只注册基础插件
 * ```
 * 
 * 使用方式 3：手动注册
 * ```typescript
 * import { ExampleBasicPlugin } from './plugins';
 * import { formulaPluginRegistry } from './core/plugin';
 * 
 * await formulaPluginRegistry.registerPlugin(ExampleBasicPlugin);
 * ```
 */


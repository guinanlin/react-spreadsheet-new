/**
 * 插件系统类型定义
 * 定义了创建自定义公式插件所需的所有接口和类型
 */

/**
 * 公式执行上下文
 * 提供给插件函数的执行环境信息
 */
export interface FormulaContext {
  /** 当前工作表ID */
  sheetId?: string;
  
  /** 公式所在行号（从0开始） */
  row?: number;
  
  /** 公式所在列号（从0开始） */
  col?: number;
  
  /** 当前单元格数据 */
  cell?: any;
  
  /** 扩展数据（供插件自定义使用） */
  [key: string]: any;
}

/**
 * 函数参数定义
 */
export interface FunctionParam {
  /** 参数名称 */
  name: string;
  
  /** 参数类型 */
  type: 'number' | 'string' | 'boolean' | 'range' | 'any';
  
  /** 是否必填 */
  required?: boolean;
  
  /** 参数描述 */
  description?: string;
}

/**
 * 插件函数定义
 * 每个插件可以提供多个函数
 */
export interface PluginFunction {
  /** 函数名（大写，如 "MY_FUNCTION"） */
  name: string;
  
  /** 函数分类（用于文档和搜索） */
  category?: 'financial' | 'statistical' | 'text' | 'logical' | 'custom' | string;
  
  /** 函数描述 */
  description?: string;
  
  /** 参数说明 */
  params?: FunctionParam[];
  
  /** 
   * 函数执行逻辑
   * @param args - 来自公式的参数数组
   * @param context - 上下文信息（单元格位置、sheet等）
   * @returns 计算结果或错误（#N/A, #ERROR!, #VALUE!等）
   */
  execute: (args: any[], context?: FormulaContext) => any;
  
  /** 是否异步函数（如果是，需要特殊处理） */
  async?: boolean;
  
  /** 示例用法 */
  examples?: string[];
}

/**
 * 插件服务配置
 * 用于配置外部API连接
 */
export interface PluginServiceConfig {
  /** API基础URL */
  baseUrl?: string;
  
  /** 请求超时时间（毫秒） */
  timeout?: number;
  
  /** 默认请求头 */
  headers?: Record<string, string>;
  
  /** 其他配置 */
  [key: string]: any;
}

/**
 * 公式插件接口
 * 定义一个完整的插件应该包含的内容
 */
export interface FormulaPlugin {
  /** 插件唯一标识（建议使用反向域名，如 "com.company.plugin"） */
  id: string;
  
  /** 插件名称（用于显示） */
  name: string;
  
  /** 插件版本 */
  version: string;
  
  /** 插件作者 */
  author?: string;
  
  /** 插件描述 */
  description?: string;
  
  /**
   * 插件初始化
   * 在插件注册时调用，可以在这里进行：
   * - 数据预加载
   * - 连接外部服务
   * - 初始化缓存
   */
  initialize?: () => Promise<void> | void;
  
  /**
   * 插件卸载
   * 在插件被移除时调用，用于清理资源
   */
  destroy?: () => void;
  
  /**
   * 插件提供的函数列表
   */
  functions: PluginFunction[];
  
  /**
   * 可选：服务端点配置
   * 如果插件需要调用外部API，可在此配置
   */
  serviceConfig?: PluginServiceConfig;
}

/**
 * 全局插件队列类型声明
 * 用于在浏览器环境中存储待注册的插件
 */
declare global {
  interface Window {
    __PENDING_PLUGINS__?: FormulaPlugin[];
  }
}


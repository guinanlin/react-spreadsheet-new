/**
 * ERP Agent 销售智能体组件库 - 统一导出入口
 */

// ============================================
// 导出组件
// ============================================
export { SalesFlow } from './components/SalesFlow';
export { SalesNodeDetail } from './components/SalesNodeDetail';

// ============================================
// 导出 Hooks
// ============================================
export { 
  useSalesWorkflow,
  createDefaultSalesNodes,
  createDefaultSalesEdges,
} from './hooks/use-sales-workflow';

// ============================================
// 导出工具函数
// ============================================
export {
  cn,
  generateId,
  formatDate,
  formatTime,
  formatDateTime,
  getStatusText,
  getBusinessTypeText,
  getStatusColor,
  getBusinessTypeColor,
  calculateDaysBetween,
  formatFileSize,
  formatCurrency,
  deepClone,
  isValidEmail,
  isValidPhone,
  generateDefaultStatistics,
  calculateProgress,
  getPriorityColor,
  debounce,
  throttle,
} from './lib/utils';

// ============================================
// 导出类型
// ============================================
export type {
  // 基础数据类型
  SalesNodeType,
  SalesNodeStatus,
  BusinessType,
  SalesNodeData,
  SalesDetailData,
  
  // 组件 Props
  SalesFlowProps,
  SalesNodeDetailProps,
  
  // 工作流相关类型
  SalesWorkflowConfig,
  SalesStatistics,
  
  // Hook 相关类型
  UseSalesWorkflowReturn,
} from './types';

/**
 * 产品列表表格组件库 - 统一导出入口
 */

// ============================================
// 导出组件
// ============================================
export { ProductListTable } from './components/ProductListTable';
export { AddProductDialog } from './components/AddProductDialog';
export { ColorSelectEditor, ColorSelectViewer } from './components/ColorSelectEditor';
export { ActionCellViewer } from './components/ActionCell';

// ============================================
// 导出工具函数
// ============================================
export {
  productsToMatrix,
  matrixToProducts,
  createEmptyProduct,
  validateProduct,
  formatCurrency,
  calculateTotalAmount,
  generateId,
} from './lib/utils';

// ============================================
// 导出类型
// ============================================
export type {
  // 基础数据类型
  ProductItem,
  ProductListTableProps,
  AddProductDialogProps,
  ColorCell,
  ActionCell,
  
  // 枚举和常量类型
  TableColumn,
} from './types';

// ============================================
// 导出常量
// ============================================
export { COLUMN_LABELS, DEFAULT_COLOR_OPTIONS } from './types';

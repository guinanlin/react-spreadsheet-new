import type { CellBase } from '../spreadsheet';

/**
 * 产品数据结构
 */
export interface ProductItem {
  /** 产品唯一标识 */
  id: string;
  /** 颜色 */
  color: string;
  /** 部位 */
  part: string;
  /** 单位 */
  unit: string;
  /** 数量 */
  quantity: number;
  /** 销售单价 */
  unitPrice: number;
  /** 销售金额（自动计算） */
  totalPrice?: number;
  /** 备注 */
  note: string;
}

/**
 * 产品列表表格组件 Props
 */
export interface ProductListTableProps {
  /** 产品列表数据 */
  products?: ProductItem[];
  /** 数据变化回调 */
  onChange?: (products: ProductItem[]) => void;
  /** 可选的颜色列表 */
  colorOptions?: string[];
  /** 自定义类名 */
  className?: string;
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否暗色模式 */
  darkMode?: boolean;
  /** 是否显示序号列 */
  showIndexColumn?: boolean;
}

/**
 * 添加产品对话框 Props
 */
export interface AddProductDialogProps {
  /** 是否打开对话框 */
  open: boolean;
  /** 关闭对话框回调 */
  onOpenChange: (open: boolean) => void;
  /** 添加产品回调 */
  onAddProduct: (product: Omit<ProductItem, 'id' | 'totalPrice'>) => void;
  /** 可选的颜色列表 */
  colorOptions?: string[];
}

/**
 * 颜色选择单元格类型
 */
export interface ColorCell extends CellBase<string> {
  /** 颜色选项列表 */
  colorOptions?: string[];
}

/**
 * 操作单元格类型
 */
export interface ActionCell extends CellBase<string> {
  /** 产品 ID */
  productId: string;
  /** 删除回调 */
  onDelete: (productId: string) => void;
  /** 新增行回调 */
  onAddRow: (productId: string) => void;
}

/**
 * 表格列定义
 */
export enum TableColumn {
  INDEX = 0,      // 序号
  COLOR = 1,      // 颜色
  PART = 2,       // 部位
  UNIT = 3,       // 单位
  QUANTITY = 4,   // 数量
  UNIT_PRICE = 5, // 销售单价
  TOTAL_PRICE = 6, // 销售金额
  NOTE = 7,       // 备注
  ACTION = 8,     // 操作
}

/**
 * 列标签配置
 */
export const COLUMN_LABELS = [
  '序号',
  '颜色',
  '部位',
  '单位',
  '数量',
  '销售单价',
  '销售金额',
  '备注',
  '操作',
] as const;

/**
 * 不包含序号列的标签配置
 */
export const COLUMN_LABELS_NO_INDEX = [
  '颜色',
  '部位',
  '单位',
  '数量',
  '销售单价',
  '销售金额',
  '备注',
  '操作',
] as const;

/**
 * 默认颜色选项
 */
export const DEFAULT_COLOR_OPTIONS = [
  '金色',
  '银色',
  '黑色',
  '白色',
  '红色',
  '蓝色',
  '绿色',
  '黄色',
] as const;

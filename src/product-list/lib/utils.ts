import type { Matrix, CellBase } from '../../spreadsheet';
import type { ProductItem, ColorCell, ActionCell, TableColumn } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * 将产品列表转换为 Spreadsheet Matrix 格式
 */
export function productsToMatrix(
  products: ProductItem[],
  colorOptions: string[] = [],
  onDelete: (productId: string) => void,
  showIndexColumn: boolean = true,
  onAddRow: (productId: string) => void = () => {}
): Matrix<CellBase> {
  if (products.length === 0) {
    return [[]];
  }

  const matrix: Matrix<CellBase> = [];
  
  // 为每个产品创建一行数据
  products.forEach((product, rowIndex) => {
    const row: CellBase[] = [];
    
    if (showIndexColumn) {
      // 带序号列的布局
      row[0] = {
        value: rowIndex + 1,
        readOnly: true,
        className: 'text-center',
      };
      
      // 颜色列
      row[1] = {
        value: product.color,
        className: 'color-cell',
        colorOptions,
        DataViewer: undefined, // 将在运行时设置
        DataEditor: undefined, // 将在运行时设置
      } as ColorCell;
      
      // 部位列
      row[2] = {
        value: product.part,
        className: 'text-left',
      };
      
      // 单位列
      row[3] = {
        value: product.unit,
        className: 'text-center',
      };
      
      // 数量列
      row[4] = {
        value: product.quantity,
        className: 'text-right number-cell',
      };
      
      // 销售单价列
      row[5] = {
        value: product.unitPrice,
        className: 'text-right number-cell',
      };
      
      // 销售金额列（自动计算，只读）
      const totalPrice = product.quantity * product.unitPrice;
      row[6] = {
        value: totalPrice,
        readOnly: true,
        className: 'text-right number-cell total-price-cell',
      };
      
      // 备注列
      row[7] = {
        value: product.note,
        className: 'text-left',
      };
      
      // 操作列
      row[8] = {
        value: 'actions',
        readOnly: true,
        className: 'text-center action-cell',
        productId: product.id,
        onDelete,
        onAddRow,
        DataViewer: undefined, // 将在运行时设置
      } as ActionCell;
    } else {
      // 不带序号列的布局
      // 颜色列
      row[0] = {
        value: product.color,
        className: 'color-cell',
        colorOptions,
        DataViewer: undefined, // 将在运行时设置
        DataEditor: undefined, // 将在运行时设置
      } as ColorCell;
      
      // 部位列
      row[1] = {
        value: product.part,
        className: 'text-left',
      };
      
      // 单位列
      row[2] = {
        value: product.unit,
        className: 'text-center',
      };
      
      // 数量列
      row[3] = {
        value: product.quantity,
        className: 'text-right number-cell',
      };
      
      // 销售单价列
      row[4] = {
        value: product.unitPrice,
        className: 'text-right number-cell',
      };
      
      // 销售金额列（自动计算，只读）
      const totalPrice = product.quantity * product.unitPrice;
      row[5] = {
        value: totalPrice,
        readOnly: true,
        className: 'text-right number-cell total-price-cell',
      };
      
      // 备注列
      row[6] = {
        value: product.note,
        className: 'text-left',
      };
      
      // 操作列
      row[7] = {
        value: 'actions',
        readOnly: true,
        className: 'text-center action-cell',
        productId: product.id,
        onDelete,
        onAddRow,
        DataViewer: undefined, // 将在运行时设置
      } as ActionCell;
    }
    
    matrix[rowIndex] = row;
  });
  
  // 添加合计行
  const totalAmount = products.reduce((sum, product) => 
    sum + (product.quantity * product.unitPrice), 0
  );
  
  const totalRow: CellBase[] = [];
  
  if (showIndexColumn) {
    totalRow[0] = { value: '', readOnly: true, className: 'total-row' };
    totalRow[1] = { value: '', readOnly: true, className: 'total-row' };
    totalRow[2] = { value: '', readOnly: true, className: 'total-row' };
    totalRow[3] = { value: '', readOnly: true, className: 'total-row' };
    totalRow[4] = { value: '', readOnly: true, className: 'total-row' };
    totalRow[5] = { value: '合计', readOnly: true, className: 'total-row font-semibold' };
    totalRow[6] = { 
      value: totalAmount, 
      readOnly: true, 
      className: 'text-right number-cell total-row font-semibold' 
    };
    totalRow[7] = { value: '', readOnly: true, className: 'total-row' };
    totalRow[8] = { value: '', readOnly: true, className: 'total-row' };
  } else {
    totalRow[0] = { value: '', readOnly: true, className: 'total-row' };
    totalRow[1] = { value: '', readOnly: true, className: 'total-row' };
    totalRow[2] = { value: '', readOnly: true, className: 'total-row' };
    totalRow[3] = { value: '', readOnly: true, className: 'total-row' };
    totalRow[4] = { value: '合计', readOnly: true, className: 'total-row font-semibold' };
    totalRow[5] = { 
      value: totalAmount, 
      readOnly: true, 
      className: 'text-right number-cell total-row font-semibold' 
    };
    totalRow[6] = { value: '', readOnly: true, className: 'total-row' };
    totalRow[7] = { value: '', readOnly: true, className: 'total-row' };
  }
  
  matrix.push(totalRow);
  
  return matrix;
}

/**
 * 将 Spreadsheet Matrix 转换为产品列表
 */
export function matrixToProducts(matrix: Matrix<CellBase>): ProductItem[] {
  const products: ProductItem[] = [];
  
  // 排除合计行（最后一行）
  const dataRows = matrix.slice(0, -1);
  
  dataRows.forEach((row, index) => {
    if (!row) return;
    
    const product: ProductItem = {
      id: generateId(), // 新生成 ID，实际应用中可能需要保持原有 ID
      color: String(row[TableColumn.COLOR]?.value || ''),
      part: String(row[TableColumn.PART]?.value || ''),
      unit: String(row[TableColumn.UNIT]?.value || ''),
      quantity: Number(row[TableColumn.QUANTITY]?.value || 0),
      unitPrice: Number(row[TableColumn.UNIT_PRICE]?.value || 0),
      note: String(row[TableColumn.NOTE]?.value || ''),
    };
    
    // 自动计算销售金额
    product.totalPrice = product.quantity * product.unitPrice;
    
    products.push(product);
  });
  
  return products;
}

/**
 * 创建空产品项
 */
export function createEmptyProduct(): Omit<ProductItem, 'id' | 'totalPrice'> {
  return {
    color: '',
    part: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
    note: '',
  };
}

/**
 * 验证产品数据
 */
export function validateProduct(product: Partial<ProductItem>): string[] {
  const errors: string[] = [];
  
  if (!product.color || product.color.trim() === '') {
    errors.push('颜色不能为空');
  }
  
  if (!product.part || product.part.trim() === '') {
    errors.push('部位不能为空');
  }
  
  if (!product.unit || product.unit.trim() === '') {
    errors.push('单位不能为空');
  }
  
  if (product.quantity === undefined || product.quantity < 0) {
    errors.push('数量必须大于等于0');
  }
  
  if (product.unitPrice === undefined || product.unitPrice < 0) {
    errors.push('销售单价必须大于等于0');
  }
  
  return errors;
}

/**
 * 格式化金额显示
 */
export function formatCurrency(amount: number): string {
  return amount.toFixed(2);
}

/**
 * 计算产品列表总金额
 */
export function calculateTotalAmount(products: ProductItem[]): number {
  return products.reduce((sum, product) => 
    sum + (product.quantity * product.unitPrice), 0
  );
}

import React, { useState, useCallback, useMemo } from 'react';
import { Spreadsheet, type CellBase, type DataEditorComponent, type DataViewerComponent } from '../../spreadsheet';
import type { ProductListTableProps, ProductItem, ColorCell, ActionCell } from '../types';
import { COLUMN_LABELS, COLUMN_LABELS_NO_INDEX, DEFAULT_COLOR_OPTIONS } from '../types';
import { productsToMatrix, matrixToProducts, generateId } from '../lib/utils';
import { ColorSelectEditor, ColorSelectViewer } from './ColorSelectEditor';
import { ActionCellViewer } from './ActionCell';
import { AddProductDialog } from './AddProductDialog';
import { Button } from '../../components/ui/button';
import { PlusIcon } from 'lucide-react';

/**
 * 产品列表表格组件
 * 基于 Spreadsheet 组件实现的产品列表管理功能
 */
export const ProductListTable: React.FC<ProductListTableProps> = ({
  products = [],
  onChange,
  colorOptions = DEFAULT_COLOR_OPTIONS,
  className,
  showToolbar = true,
  darkMode = false,
  showIndexColumn = true,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [internalProducts, setInternalProducts] = useState<ProductItem[]>(products);

  // 使用受控或非受控模式
  const currentProducts = onChange ? products : internalProducts;
  const setCurrentProducts = onChange || setInternalProducts;

  // 处理删除产品
  const handleDeleteProduct = useCallback((productId: string) => {
    console.log('handleDeleteProduct 被调用:', productId);
    const updatedProducts = currentProducts.filter(p => p.id !== productId);
    setCurrentProducts(updatedProducts);
  }, [currentProducts, setCurrentProducts]);

  // 处理新增行
  const handleAddRow = useCallback((productId: string) => {
    console.log('handleAddRow 被调用:', productId);
    const targetIndex = currentProducts.findIndex(p => p.id === productId);
    if (targetIndex === -1) {
      console.error('未找到目标产品:', productId);
      return;
    }
    
    const newProduct: ProductItem = {
      id: generateId(),
      color: '',
      part: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      note: '',
    };
    
    // 在目标产品下方插入新行
    const updatedProducts = [
      ...currentProducts.slice(0, targetIndex + 1),
      newProduct,
      ...currentProducts.slice(targetIndex + 1),
    ];
    
    console.log('新增行后的产品列表:', updatedProducts);
    setCurrentProducts(updatedProducts);
  }, [currentProducts, setCurrentProducts]);

  // 处理添加产品
  const handleAddProduct = useCallback((newProduct: Omit<ProductItem, 'id' | 'totalPrice'>) => {
    const product: ProductItem = {
      ...newProduct,
      id: generateId(),
      totalPrice: newProduct.quantity * newProduct.unitPrice,
    };
    
    const updatedProducts = [...currentProducts, product];
    setCurrentProducts(updatedProducts);
    setIsAddDialogOpen(false);
  }, [currentProducts, setCurrentProducts]);

  // 将产品数据转换为 Spreadsheet Matrix
  const spreadsheetData = useMemo(() => {
    console.log('转换产品数据到 Spreadsheet Matrix:', currentProducts);
    console.log('handleDeleteProduct:', handleDeleteProduct);
    console.log('handleAddRow:', handleAddRow);
    
    const matrix = productsToMatrix(currentProducts, colorOptions, handleDeleteProduct, showIndexColumn, handleAddRow);
    
    // 为特定单元格设置自定义组件
    matrix.forEach((row, rowIndex) => {
      if (!row) return;
      
      const colorColumn = showIndexColumn ? 1 : 0;
      const actionColumn = showIndexColumn ? 8 : 7;
      
      // 设置颜色列的自定义组件
      if (row[colorColumn]) {
        (row[colorColumn] as ColorCell).DataViewer = ColorSelectViewer;
        (row[colorColumn] as ColorCell).DataEditor = ColorSelectEditor;
      }
      
      // 设置操作列的自定义组件
      if (row[actionColumn]) {
        (row[actionColumn] as ActionCell).DataViewer = ActionCellViewer;
        console.log('设置操作列自定义组件:', row[actionColumn]);
      }
    });
    
    console.log('最终的 Spreadsheet Matrix:', matrix);
    return matrix;
  }, [currentProducts, colorOptions, handleDeleteProduct, showIndexColumn, handleAddRow]);

  // 处理 Spreadsheet 数据变化
  const handleSpreadsheetChange = useCallback((newData: CellBase[][]) => {
    // 排除合计行（最后一行）
    const dataRows = newData.slice(0, -1);
    
    const updatedProducts: ProductItem[] = [];
    
    dataRows.forEach((row, index) => {
      if (!row) return;
      
      // 保持原有的产品 ID
      const originalProduct = currentProducts[index];
      
      const product: ProductItem = {
        id: originalProduct?.id || generateId(),
        color: String(row[1]?.value || ''),
        part: String(row[2]?.value || ''),
        unit: String(row[3]?.value || ''),
        quantity: Number(row[4]?.value || 0),
        unitPrice: Number(row[5]?.value || 0),
        note: String(row[7]?.value || ''),
      };
      
      // 自动计算销售金额
      product.totalPrice = product.quantity * product.unitPrice;
      
      updatedProducts.push(product);
    });
    
    setCurrentProducts(updatedProducts);
  }, [currentProducts, setCurrentProducts]);


  return (
    <div className={`product-list-table ${className || ''}`}>
      {showToolbar && (
        <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">产品列表</h2>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            添加产品
          </Button>
        </div>
      )}
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Spreadsheet
          data={spreadsheetData}
          onChange={handleSpreadsheetChange}
          columnLabels={showIndexColumn ? COLUMN_LABELS : COLUMN_LABELS_NO_INDEX}
          rowIndicatorWidth="40px"
          columnIndicatorWidth="80px"
          darkMode={darkMode}
          className="product-spreadsheet"
        />
      </div>
      
      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddProduct={handleAddProduct}
        colorOptions={colorOptions}
      />
    </div>
  );
};

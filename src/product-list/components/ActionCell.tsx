import React from 'react';
import type { ActionCell } from '../types';
import { Button } from '../../components/ui/button';
import { TrashIcon, PlusIcon } from 'lucide-react';

/**
 * 操作单元格查看器
 * 显示新增行和删除行按钮
 */
export const ActionCellViewer: React.FC<{
  cell?: ActionCell;
  setCellData: (cell: ActionCell) => void;
}> = ({ cell }) => {
  const actionCell = cell as ActionCell;
  
  if (!actionCell?.productId) {
    return null;
  }

  const handleAddRow = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('点击新增行按钮:', actionCell.productId, 'onAddRow:', actionCell.onAddRow);
    if (actionCell.onAddRow) {
      actionCell.onAddRow(actionCell.productId);
    } else {
      console.error('onAddRow 回调函数不存在');
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('点击删除按钮:', actionCell.productId, 'onDelete:', actionCell.onDelete);
    if (actionCell.onDelete) {
      actionCell.onDelete(actionCell.productId);
    } else {
      console.error('onDelete 回调函数不存在');
    }
  };

  return (
    <div 
      className="flex justify-center gap-1"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddRow}
        onMouseDown={(e) => e.stopPropagation()}
        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
        title="在下方插入新行"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        onMouseDown={(e) => e.stopPropagation()}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        title="删除当前行"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

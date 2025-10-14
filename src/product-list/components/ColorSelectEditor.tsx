import React, { useState, useEffect } from 'react';
import type { DataEditorComponent } from '../../spreadsheet';
import type { ColorCell } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

/**
 * 颜色选择编辑器组件
 * 用于 Spreadsheet 单元格中的颜色选择
 */
export const ColorSelectEditor: DataEditorComponent<ColorCell> = ({
  cell,
  onChange,
  exitEditMode,
}) => {
  const [selectedColor, setSelectedColor] = useState(cell?.value || '');
  const colorOptions = (cell as ColorCell)?.colorOptions || [];

  useEffect(() => {
    setSelectedColor(cell?.value || '');
  }, [cell?.value]);

  const handleValueChange = (value: string) => {
    setSelectedColor(value);
    if (cell) {
      onChange({
        ...cell,
        value,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      exitEditMode();
    }
  };

  return (
    <div 
      className="w-full h-full"
      onKeyDown={handleKeyDown}
    >
      <Select 
        value={selectedColor} 
        onValueChange={handleValueChange}
        open
      >
        <SelectTrigger className="w-full h-full border-none shadow-none focus:ring-0 bg-transparent">
          <SelectValue placeholder="选择颜色" />
        </SelectTrigger>
        <SelectContent>
          {colorOptions.map((color) => (
            <SelectItem key={color} value={color}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ 
                    backgroundColor: getColorValue(color),
                  }}
                />
                <span>{color}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

/**
 * 颜色选择查看器组件
 * 用于显示选中的颜色
 */
export const ColorSelectViewer: React.FC<{
  cell?: ColorCell;
  setCellData: (cell: ColorCell) => void;
}> = ({ cell }) => {
  const color = cell?.value || '';
  
  if (!color) {
    return <span className="text-gray-400">未选择</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-4 h-4 rounded border flex-shrink-0"
        style={{ 
          backgroundColor: getColorValue(color),
        }}
      />
      <span>{color}</span>
    </div>
  );
};

/**
 * 获取颜色的实际颜色值
 */
function getColorValue(colorName: string): string {
  const colorMap: Record<string, string> = {
    '金色': '#FFD700',
    '银色': '#C0C0C0',
    '黑色': '#000000',
    '白色': '#FFFFFF',
    '红色': '#FF0000',
    '蓝色': '#0000FF',
    '绿色': '#008000',
    '黄色': '#FFFF00',
    '灰色': '#808080',
    '紫色': '#800080',
    '橙色': '#FFA500',
    '粉色': '#FFC0CB',
  };
  
  return colorMap[colorName] || '#CCCCCC';
}

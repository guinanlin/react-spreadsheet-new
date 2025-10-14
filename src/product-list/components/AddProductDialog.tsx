import React, { useState, useEffect } from 'react';
import type { AddProductDialogProps } from '../types';
import { DEFAULT_COLOR_OPTIONS } from '../types';
import { createEmptyProduct, validateProduct } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';

/**
 * 添加产品对话框组件
 */
export const AddProductDialog: React.FC<AddProductDialogProps> = ({
  open,
  onOpenChange,
  onAddProduct,
  colorOptions = DEFAULT_COLOR_OPTIONS,
}) => {
  const [formData, setFormData] = useState(createEmptyProduct());
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 重置表单数据
  useEffect(() => {
    if (open) {
      setFormData(createEmptyProduct());
      setErrors([]);
    }
  }, [open]);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // 清除该字段的错误
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateProduct(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAddProduct(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('添加产品失败:', error);
      setErrors(['添加产品失败，请重试']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>添加新产品</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">颜色 *</Label>
              <Select 
                value={formData.color} 
                onValueChange={(value) => handleInputChange('color', value)}
              >
                <SelectTrigger>
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
            
            <div className="space-y-2">
              <Label htmlFor="part">部位 *</Label>
              <Input
                id="part"
                value={formData.part}
                onChange={(e) => handleInputChange('part', e.target.value)}
                placeholder="请输入部位"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">单位 *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                placeholder="如：件、个、套"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">数量 *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">销售单价 *</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalPrice">销售金额</Label>
              <Input
                id="totalPrice"
                type="number"
                value={formData.quantity * formData.unitPrice}
                readOnly
                className="bg-gray-50"
                placeholder="自动计算"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">备注</Label>
            <Input
              id="note"
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              placeholder="请输入备注信息（可选）"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '添加中...' : '添加产品'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

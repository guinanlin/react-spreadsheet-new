# ProductListTable 产品列表表格组件

基于 Spreadsheet 组件构建的产品列表管理表格，支持内联编辑、自动计算金额、颜色选择和产品管理功能。

## 🚀 功能特性

- ✅ **内联编辑**: 所有单元格支持点击直接编辑
- ✅ **颜色选择**: 颜色列使用下拉选择器，支持预设颜色选项
- ✅ **自动计算**: 销售金额自动计算（数量 × 销售单价）
- ✅ **合计统计**: 底部自动显示销售金额合计
- ✅ **产品管理**: 支持添加和删除产品
- ✅ **行操作**: 支持在任意行下方插入新行或删除当前行
- ✅ **数据验证**: 添加产品时进行数据验证
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **响应式设计**: 适配不同屏幕尺寸

## 📦 安装

组件已集成到项目中，可以直接导入使用：

```typescript
import { ProductListTable } from '@/product-list';
```

## 🎯 基础用法

### 简单使用

```tsx
import React from 'react';
import { ProductListTable } from '@/product-list';

function App() {
  return (
    <ProductListTable />
  );
}
```

### 行操作功能

操作列提供两个按钮：
- **➕ 新增行**: 在当前行下方插入一个新的空行
- **🗑️ 删除行**: 删除当前行

```tsx
<ProductListTable
  showIndexColumn={false}  // 不显示序号列，使用 Spreadsheet 自带行号
  products={products}
  onChange={setProducts}
/>
```

### 受控模式

```tsx
import React, { useState } from 'react';
import { ProductListTable } from '@/product-list';
import type { ProductItem } from '@/product-list';

function App() {
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: '1',
      color: '金色',
      part: '前部',
      unit: '件',
      quantity: 10,
      unitPrice: 25.5,
      note: '高质量产品',
    },
  ]);

  return (
    <ProductListTable
      products={products}
      onChange={setProducts}
    />
  );
}
```

### 自定义颜色选项

```tsx
<ProductListTable
  colorOptions={['红色', '蓝色', '绿色', '黄色', '紫色']}
/>
```

## 📋 API 文档

### ProductListTable Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| products | `ProductItem[]` | `[]` | 产品列表数据 |
| onChange | `(products: ProductItem[]) => void` | - | 数据变化回调 |
| colorOptions | `string[]` | `DEFAULT_COLOR_OPTIONS` | 可选的颜色列表 |
| className | `string` | - | 自定义CSS类名 |
| showToolbar | `boolean` | `true` | 是否显示工具栏 |
| showIndexColumn | `boolean` | `true` | 是否显示序号列（false时使用 Spreadsheet 自带行号） |
| darkMode | `boolean` | `false` | 是否启用暗色模式 |

### ProductItem 类型

```typescript
interface ProductItem {
  id: string;           // 产品唯一标识
  color: string;        // 颜色
  part: string;         // 部位
  unit: string;         // 单位
  quantity: number;     // 数量
  unitPrice: number;    // 销售单价
  totalPrice?: number;  // 销售金额（自动计算）
  note: string;         // 备注
}
```

## 🎨 样式定制

### CSS 类名

组件提供了以下 CSS 类名用于样式定制：

```css
.product-list-table {
  /* 主容器样式 */
}

.product-spreadsheet {
  /* Spreadsheet 容器样式 */
}

.color-cell {
  /* 颜色单元格样式 */
}

.number-cell {
  /* 数字单元格样式 */
}

.total-price-cell {
  /* 销售金额单元格样式 */
}

.total-row {
  /* 合计行样式 */
}

.action-cell {
  /* 操作单元格样式 */
}
```

### 主题定制

```tsx
<ProductListTable
  darkMode={true}
  className="custom-product-table"
/>
```

## 🔧 高级用法

### 自定义颜色映射

```tsx
const customColors = [
  '玫瑰金',
  '香槟金',
  '铂金',
  '钛金',
];

<ProductListTable
  colorOptions={customColors}
/>
```

### 数据验证

```tsx
import { validateProduct } from '@/product-list';

const errors = validateProduct({
  color: '',
  part: '前部',
  unit: '件',
  quantity: -1,
  unitPrice: 0,
  note: '',
});

if (errors.length > 0) {
  console.log('验证错误:', errors);
}
```

### 工具函数

```tsx
import { 
  formatCurrency, 
  calculateTotalAmount,
  createEmptyProduct 
} from '@/product-list';

// 格式化金额
const formatted = formatCurrency(123.45); // "123.45"

// 计算总金额
const total = calculateTotalAmount(products);

// 创建空产品
const emptyProduct = createEmptyProduct();
```

## 📱 响应式设计

组件支持响应式设计，在不同屏幕尺寸下自动调整：

- **桌面端**: 完整功能展示
- **平板端**: 自适应列宽
- **移动端**: 横向滚动支持

## 🎭 Storybook 示例

访问 Storybook 查看所有使用示例：

```bash
npm run storybook
```

在 Storybook 中可以找到以下示例：

- **Basic**: 基础用法
- **WithInitialData**: 带有初始数据
- **Empty**: 空列表状态
- **CustomColors**: 自定义颜色选项
- **Controlled**: 受控模式示例
- **DarkMode**: 暗色模式
- **LargeDataset**: 大量数据性能测试
- **Interactive**: 交互演示

## 🚨 注意事项

1. **性能考虑**: 大量数据时建议使用虚拟化或分页
2. **数据验证**: 添加产品时会自动进行数据验证
3. **颜色选项**: 颜色选项会影响颜色选择器的可用选项
4. **ID 生成**: 产品 ID 会自动生成，确保唯一性
5. **计算精度**: 金额计算使用 JavaScript 数字，注意浮点数精度

## 🐛 故障排除

### 常见问题

**Q: 颜色选择器不显示？**
A: 确保 `colorOptions` 数组不为空，且包含有效的颜色选项。

**Q: 销售金额不自动计算？**
A: 检查数量和单价列的数据类型是否为数字。

**Q: 删除按钮不工作？**
A: 确保在受控模式下正确传递 `onChange` 回调函数。

### 调试模式

```tsx
<ProductListTable
  products={products}
  onChange={(newProducts) => {
    console.log('产品数据更新:', newProducts);
  }}
/>
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个组件！

## 📄 许可证

MIT License

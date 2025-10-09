# React Spreadsheet 使用示例

## 基础示例 - Next.js App Router

### 1. 创建客户端组件

创建文件 `components/SpreadsheetDemo.tsx`：

```tsx
'use client';

import { useState } from 'react';
import { Spreadsheet } from '@/components/ui/spreadsheet';
import type { Matrix } from '@/components/ui/spreadsheet/types';

// 定义单元格类型
type CellType = {
  value: string | number;
  readOnly?: boolean;
  className?: string;
};

export function SpreadsheetDemo() {
  // 初始化 6x4 的数据
  const [data, setData] = useState<Matrix<CellType>>([
    [
      { value: '姓名' },
      { value: '年龄' },
      { value: '城市' },
      { value: '职位' },
    ],
    [
      { value: '张三' },
      { value: 28 },
      { value: '北京' },
      { value: '工程师' },
    ],
    [
      { value: '李四' },
      { value: 32 },
      { value: '上海' },
      { value: '设计师' },
    ],
    [
      { value: '王五' },
      { value: 25 },
      { value: '深圳' },
      { value: '产品经理' },
    ],
    [
      { value: '赵六' },
      { value: 30 },
      { value: '杭州' },
      { value: '运营' },
    ],
    [
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
    ],
  ]);

  return (
    <div className="w-full h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">员工信息表</h1>
      <div className="border rounded-lg overflow-hidden">
        <Spreadsheet
          data={data}
          onChange={setData}
          columnLabels={['A', 'B', 'C', 'D']}
          rowLabels={['1', '2', '3', '4', '5', '6']}
        />
      </div>
    </div>
  );
}
```

### 2. 在页面中使用

创建或编辑 `app/spreadsheet-demo/page.tsx`：

```tsx
import { SpreadsheetDemo } from '@/components/SpreadsheetDemo';

export default function Page() {
  return <SpreadsheetDemo />;
}
```

### 3. 添加样式（可选）

如果样式有问题，在 `app/globals.css` 中添加：

```css
/* Spreadsheet 样式优化 */
.Spreadsheet {
  font-family: var(--font-sans);
}

.Spreadsheet__table {
  border-collapse: collapse;
}

.Spreadsheet__cell {
  border: 1px solid #e5e7eb;
  padding: 8px;
  min-width: 120px;
}

.Spreadsheet__cell:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}
```

---

## 进阶示例

### 示例 1: 只读单元格

```tsx
'use client';

import { useState } from 'react';
import { Spreadsheet } from '@/components/ui/spreadsheet';

export function ReadOnlyExample() {
  const [data, setData] = useState([
    [
      { value: '产品', readOnly: true }, // 只读
      { value: '单价', readOnly: true },
      { value: '数量' },
      { value: '总价', readOnly: true },
    ],
    [
      { value: 'iPhone 15', readOnly: true },
      { value: 5999, readOnly: true },
      { value: 10 },
      { value: '=B2*C2', readOnly: true }, // 公式
    ],
    [
      { value: 'MacBook Pro', readOnly: true },
      { value: 12999, readOnly: true },
      { value: 5 },
      { value: '=B3*C3', readOnly: true },
    ],
  ]);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">产品订单（带公式计算）</h2>
      <Spreadsheet data={data} onChange={setData} />
    </div>
  );
}
```

### 示例 2: 自定义列标签

```tsx
'use client';

import { useState } from 'react';
import { Spreadsheet } from '@/components/ui/spreadsheet';

export function CustomLabelsExample() {
  const [data, setData] = useState([
    [{ value: '张三' }, { value: 95 }, { value: 88 }, { value: 92 }],
    [{ value: '李四' }, { value: 87 }, { value: 90 }, { value: 85 }],
    [{ value: '王五' }, { value: 92 }, { value: 86 }, { value: 89 }],
  ]);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">学生成绩表</h2>
      <Spreadsheet
        data={data}
        onChange={setData}
        columnLabels={['姓名', '语文', '数学', '英语']}
        rowLabels={['学生1', '学生2', '学生3']}
      />
    </div>
  );
}
```

### 示例 3: 带操作按钮

```tsx
'use client';

import { useState } from 'react';
import { Spreadsheet } from '@/components/ui/spreadsheet';
import { Button } from '@/components/ui/button'; // 如果你有 shadcn/ui

export function SpreadsheetWithActions() {
  const [data, setData] = useState([
    [{ value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }],
  ]);

  // 添加行
  const addRow = () => {
    setData([...data, Array(data[0]?.length || 3).fill({ value: '' })]);
  };

  // 添加列
  const addColumn = () => {
    setData(data.map(row => [...row, { value: '' }]));
  };

  // 清空数据
  const clearData = () => {
    const rows = data.length;
    const cols = data[0]?.length || 0;
    setData(
      Array(rows).fill(null).map(() => 
        Array(cols).fill({ value: '' })
      )
    );
  };

  // 导出为 JSON
  const exportData = () => {
    const jsonData = data.map(row => 
      row.map(cell => cell.value)
    );
    console.log('导出数据:', jsonData);
    alert('数据已导出到控制台');
  };

  return (
    <div className="p-8">
      <div className="mb-4 space-x-2">
        <Button onClick={addRow}>添加行</Button>
        <Button onClick={addColumn}>添加列</Button>
        <Button onClick={clearData} variant="outline">清空</Button>
        <Button onClick={exportData} variant="secondary">导出</Button>
      </div>
      
      <Spreadsheet data={data} onChange={setData} />
      
      <div className="mt-4 text-sm text-gray-600">
        当前大小: {data.length} 行 × {data[0]?.length || 0} 列
      </div>
    </div>
  );
}
```

### 示例 4: 暗色模式

```tsx
'use client';

import { useState } from 'react';
import { Spreadsheet } from '@/components/ui/spreadsheet';

export function DarkModeExample() {
  const [data, setData] = useState([
    [{ value: 'A1' }, { value: 'B1' }],
    [{ value: 'A2' }, { value: 'B2' }],
  ]);

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-white">暗色模式</h2>
      <Spreadsheet 
        data={data} 
        onChange={setData}
        darkMode={true}
      />
    </div>
  );
}
```

---

## 常用 Props

```tsx
<Spreadsheet
  data={data}                    // 必需：数据矩阵
  onChange={setData}             // 必需：数据变化回调
  
  // 可选配置
  columnLabels={['A', 'B', 'C']} // 列标签
  rowLabels={['1', '2', '3']}    // 行标签
  hideColumnIndicators={false}    // 隐藏列标题
  hideRowIndicators={false}       // 隐藏行标题
  darkMode={false}                // 暗色模式
  
  // 自定义组件
  Cell={CustomCell}               // 自定义单元格
  DataViewer={CustomViewer}       // 自定义查看器
  DataEditor={CustomEditor}       // 自定义编辑器
/>
```

---

## 类型定义

```tsx
import type { 
  Matrix,        // 数据矩阵类型
  CellBase,      // 单元格基础类型
  Point,         // 坐标类型
  Selection,     // 选区类型
} from '@/components/ui/spreadsheet/types';

// 自定义单元格类型
type MyCell = CellBase<string> & {
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

// 使用
const [data, setData] = useState<Matrix<MyCell>>([...]);
```

---

## 常见问题

### 1. 样式不显示？

确保导入了 CSS：

```tsx
import '@/components/ui/spreadsheet/Spreadsheet.css';
```

或在 `app/layout.tsx` 中全局导入。

### 2. TypeScript 类型错误？

确保安装了所有依赖，特别是 `use-context-selector`。

### 3. 公式不工作？

需要安装 `fast-formula-parser`：

```bash
npm install fast-formula-parser
```

---

## 下一步

- 查看 [Storybook 示例](http://localhost:6006)
- 尝试 [透视表组件](./pivot-table-example.md)
- 查看 [完整 API 文档](https://iddan.github.io/react-spreadsheet/docs)


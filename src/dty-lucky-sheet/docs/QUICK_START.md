# DtyLuckySheet 快速开始指南

## 🎯 项目概述

DtyLuckySheet 是一个完整的类 Excel 电子表格组件，采用三层架构设计：
- **Core 层**：纯 TypeScript 核心逻辑
- **React 层**：React UI 组件
- **Formula 层**：公式解析引擎

## 🚀 快速启动

### 1. 启动 Storybook

```bash
npm run storybook
```

访问：`http://localhost:6006`

### 2. 查看示例

在 Storybook 中可以找到：

**Features 功能演示**：
- `/story/dtyluckysheet-features--basic` - 基本表格
- `/story/dtyluckysheet-features--formula` - 公式计算
- `/story/dtyluckysheet-features--empty` - 空表格
- `/story/dtyluckysheet-features--tabs` - 多工作表
- `/story/dtyluckysheet-features--multi-instance` - 多实例

**API 接口演示**：
- `/story/dtyluckysheet-api--get-cell-value` - 获取单元格值
- `/story/dtyluckysheet-api--set-cell-value` - 设置单元格值

## 📝 基础用法

### 示例 1：简单表格

```tsx
import { Workbook } from '@/dty-lucky-sheet';

function App() {
  const [data, setData] = useState([
    {
      name: "Sheet1",
      id: "1",
      celldata: [
        { r: 0, c: 0, v: { v: "Name", m: "Name" } },
        { r: 0, c: 1, v: { v: "Age", m: "Age" } },
        { r: 1, c: 0, v: { v: "Alice", m: "Alice" } },
        { r: 1, c: 1, v: { v: 25, m: "25" } },
      ],
    },
  ]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Workbook data={data} onChange={setData} />
    </div>
  );
}
```

### 示例 2：使用 API

```tsx
import { useRef } from 'react';
import { Workbook, WorkbookInstance } from '@/dty-lucky-sheet';

function App() {
  const workbookRef = useRef<WorkbookInstance>(null);

  const handleClick = () => {
    // 获取单元格值
    const value = workbookRef.current?.getCellValue(0, 0);
    console.log('Value:', value);
    
    // 设置单元格值
    workbookRef.current?.setCellValue(1, 1, 'New Value');
  };

  return (
    <>
      <button onClick={handleClick}>操作单元格</button>
      <div style={{ width: "100%", height: "100vh" }}>
        <Workbook ref={workbookRef} data={[{ name: "Sheet1" }]} />
      </div>
    </>
  );
}
```

### 示例 3：公式支持

```tsx
const data = [
  {
    name: "Formula Sheet",
    celldata: [
      { r: 0, c: 0, v: { v: 10, m: "10" } },
      { r: 0, c: 1, v: { v: 20, m: "20" } },
      { r: 0, c: 2, v: { v: 30, m: "30", f: "=A1+B1" } }, // 公式
    ],
  },
];

<Workbook data={data} onChange={setData} />
```

## 🏗️ 数据结构

### Sheet（工作表）

```typescript
type Sheet = {
  id?: string;           // 唯一标识
  name?: string;         // 工作表名称
  status?: number;       // 0-隐藏, 1-激活
  order?: number;        // 顺序
  row?: number;          // 行数
  column?: number;       // 列数
  celldata?: CellWithRowAndCol[];  // 稀疏数据
  data?: CellMatrix;     // 完整数据矩阵
};
```

### Cell（单元格）

```typescript
type Cell = {
  v?: string | number | boolean;  // 原始值
  m?: string | number;             // 显示值
  f?: string;                      // 公式
  bg?: string;                     // 背景色
  fc?: string;                     // 字体颜色
  fs?: number;                     // 字体大小
  bl?: number;                     // 加粗 (0/1)
  it?: number;                     // 斜体 (0/1)
  // ... 更多样式属性
};
```

### CellData（稀疏数据）

```typescript
type CellWithRowAndCol = {
  r: number;      // 行索引
  c: number;      // 列索引
  v: Cell | null; // 单元格数据
};
```

## ⚙️ 配置选项

### Workbook Props

```typescript
<Workbook
  data={data}                    // 工作表数据
  onChange={setData}             // 数据变化回调
  onOp={handleOp}                // 操作事件（协作用）
  column={60}                    // 默认列数
  row={84}                       // 默认行数
  allowEdit={true}               // 允许编辑
  showToolbar={true}             // 显示工具栏
  showFormulaBar={true}          // 显示公式栏
  showSheetTabs={true}           // 显示工作表标签
  devicePixelRatio={0}           // 设备像素比（0=自动）
/>
```

## 🔌 API 方法

### getCellValue

```typescript
const value = workbookRef.current?.getCellValue(row, col);
```

获取指定单元格的值。

### setCellValue

```typescript
workbookRef.current?.setCellValue(row, col, value);
```

设置指定单元格的值。

## 🎨 样式定制

### 单元格样式

```typescript
const cellWithStyle = {
  r: 0,
  c: 0,
  v: {
    v: "Styled Cell",
    m: "Styled Cell",
    bg: "#ff0000",      // 红色背景
    fc: "#ffffff",      // 白色字体
    fs: 14,             // 字体大小
    bl: 1,              // 加粗
    it: 1,              // 斜体
    ht: 1,              // 水平对齐（0-居中, 1-左, 2-右）
    vt: 0,              // 垂直对齐（0-中, 1-上, 2-下）
  },
};
```

## 📊 示例数据

### 基础表格数据

```typescript
const basicData = [
  {
    name: "Products",
    id: "sheet1",
    celldata: [
      // 标题行
      { r: 0, c: 0, v: { v: "Product", m: "Product", bg: "#f0f0f0", bl: 1 } },
      { r: 0, c: 1, v: { v: "Price", m: "Price", bg: "#f0f0f0", bl: 1 } },
      { r: 0, c: 2, v: { v: "Quantity", m: "Quantity", bg: "#f0f0f0", bl: 1 } },
      
      // 数据行
      { r: 1, c: 0, v: { v: "Apple", m: "Apple" } },
      { r: 1, c: 1, v: { v: 1.5, m: "$1.50" } },
      { r: 1, c: 2, v: { v: 100, m: "100" } },
    ],
    row: 20,
    column: 10,
  },
];
```

### 公式数据

```typescript
const formulaData = [
  {
    name: "Calculations",
    id: "sheet2",
    celldata: [
      { r: 0, c: 0, v: { v: 10, m: "10" } },
      { r: 0, c: 1, v: { v: 20, m: "20" } },
      { r: 0, c: 2, v: { v: 30, m: "30", f: "=A1+B1" } },
      { r: 1, c: 2, v: { v: 200, m: "200", f: "=A1*B1" } },
      { r: 2, c: 2, v: { v: 15, m: "15", f: "=(A1+B1)/2" } },
    ],
  },
];
```

## 🐛 调试

### 启用 Patch 日志

```typescript
// 在 Workbook 组件内部使用
setContextWithProduce(
  (ctx) => {
    // 修改状态
    ctx.luckysheetfile[0].data[0][0].v = "test";
  },
  { logPatch: true }  // 启用日志
);
```

控制台将输出：
```
patch: [{ op: 'replace', path: [...], value: ... }]
```

## 🔧 常见问题

### Q: 如何初始化空表格？

```typescript
const emptyData = [
  {
    name: "Sheet1",
    id: "1",
    // celldata 为空或不提供
  },
];

<Workbook data={emptyData} />
```

### Q: 如何创建多个工作表？

```typescript
const multiSheetData = [
  { name: "Sheet1", id: "1", celldata: [...] },
  { name: "Sheet2", id: "2", celldata: [...] },
  { name: "Sheet3", id: "3", celldata: [...] },
];

<Workbook data={multiSheetData} />
```

### Q: 容器必须有高度吗？

是的，Workbook 需要父容器有明确的高度：

```tsx
<div style={{ height: "100vh" }}>  {/* 明确高度 */}
  <Workbook data={data} />
</div>
```

### Q: 如何监听数据变化？

```typescript
const handleChange = (newData) => {
  console.log('Data changed:', newData);
  setData(newData);
};

<Workbook data={data} onChange={handleChange} />
```

## 📚 下一步

- 查看 [README.md](./README.md) 了解完整功能
- 查看 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) 了解架构
- 在 Storybook 中尝试所有示例
- 查看 [USAGE_EXAMPLE.tsx](./USAGE_EXAMPLE.tsx) 获取更多代码示例

## 🆘 获取帮助

- 查看 Storybook 示例：`npm run storybook`
- 查看 TypeScript 类型定义获取 API 文档
- 参考 FortuneSheet 文档：https://ruilisi.github.io/fortune-sheet-docs/

---

**Happy Coding! 🎉**

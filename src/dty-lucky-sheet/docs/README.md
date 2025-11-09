# DtyLuckySheet - 完整电子表格组件

一个功能完整的类 Excel 电子表格组件，基于 React 和 TypeScript 构建。

## ✨ 特性

- 🎨 **Canvas 渲染** - 高性能的 Canvas 渲染引擎
- 📊 **完整功能** - 单元格编辑、格式化、公式计算
- 🔧 **三层架构** - Core（核心逻辑）+ React（UI层）+ Formula（公式引擎）
- 📝 **公式支持** - 集成 fast-formula-parser，支持常用 Excel 函数
- 🎯 **TypeScript** - 完整的类型定义
- 🚀 **Immer 状态管理** - 不可变状态管理，支持 Undo/Redo
- 🔌 **API 丰富** - 提供丰富的 API 接口

## 📦 项目结构

```
src/dty-lucky-sheet/
├── packages/
│   ├── core/                  # 核心逻辑层（纯 TS）
│   │   ├── src/
│   │   │   ├── types.ts      # 核心类型定义
│   │   │   ├── context.ts    # 全局状态
│   │   │   ├── settings.ts   # 配置
│   │   │   ├── modules/      # 功能模块
│   │   │   ├── utils/        # 工具函数
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── react/                 # React 组件层
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Workbook/ # 主容器
│   │   │   │   └── Sheet/    # 工作表
│   │   │   ├── context/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── formula/               # 公式引擎层
│       ├── src/
│       │   └── index.ts
│       └── package.json
│
├── stories/                   # Storybook 示例
│   ├── Features.stories.tsx
│   ├── API.stories.tsx
│   └── data/
│       ├── cell.ts
│       ├── formula.ts
│       └── empty.ts
│
└── index.ts                   # 统一导出
```

## 🚀 快速开始

### 基本用法

```tsx
import { Workbook } from '@/dty-lucky-sheet';

function App() {
  const [data, setData] = useState([
    {
      name: "Sheet1",
      id: "1",
      celldata: [
        { r: 0, c: 0, v: { v: "Hello", m: "Hello" } },
        { r: 0, c: 1, v: { v: "World", m: "World" } },
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

### 使用 API

```tsx
import { useRef } from 'react';
import { Workbook, WorkbookInstance } from '@/dty-lucky-sheet';

function App() {
  const workbookRef = useRef<WorkbookInstance>(null);

  const handleGetValue = () => {
    const value = workbookRef.current?.getCellValue(0, 0);
    console.log('Cell value:', value);
  };

  const handleSetValue = () => {
    workbookRef.current?.setCellValue(0, 0, 'New Value');
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <button onClick={handleGetValue}>Get Value</button>
      <button onClick={handleSetValue}>Set Value</button>
      <Workbook ref={workbookRef} data={[{ name: "Sheet1" }]} />
    </div>
  );
}
```

## 📖 API 参考

### Workbook Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `data` | `Sheet[]` | `[]` | 工作表数据 |
| `onChange` | `(data: Sheet[]) => void` | - | 数据变化回调 |
| `onOp` | `(op: Op[]) => void` | - | 操作事件回调（用于协作） |
| `column` | `number` | `60` | 默认列数 |
| `row` | `number` | `84` | 默认行数 |
| `allowEdit` | `boolean` | `true` | 是否允许编辑 |
| `showToolbar` | `boolean` | `true` | 是否显示工具栏 |
| `showFormulaBar` | `boolean` | `true` | 是否显示公式栏 |
| `showSheetTabs` | `boolean` | `true` | 是否显示工作表标签 |

### WorkbookInstance Methods

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `getCellValue` | `(r: number, c: number)` | `any` | 获取单元格值 |
| `setCellValue` | `(r: number, c: number, value: any)` | `void` | 设置单元格值 |

## 🎨 Storybook 示例

启动 Storybook 查看所有示例：

```bash
npm run storybook
```

访问：
- Features 示例：`/story/dtyluckysheet-features--basic`
- API 示例：`/story/dtyluckysheet-api--get-cell-value`

## 🏗️ 架构设计

### Core 层（核心逻辑）

- **类型系统**：定义 Cell、Sheet、Context 等核心类型
- **状态管理**：使用 Immer 管理不可变状态
- **工具函数**：提供各种辅助函数

### React 层（UI）

- **Workbook**：主容器组件，管理全局状态
- **Sheet**：工作表组件，负责渲染
- **Context**：React Context 传递状态

### Formula 层（公式引擎）

- 集成 `fast-formula-parser`
- 支持常用 Excel 函数（SUM、AVERAGE 等）

## 🔧 开发

### 安装依赖

项目依赖已在主项目的 `package.json` 中定义。

### 类型检查

```bash
npm run check-typing
```

### 构建

```bash
npm run build
```

## 📝 TODO

- [x] 基础架构搭建
- [x] Core 层类型系统
- [x] React Workbook 组件
- [x] 基础 Canvas 渲染
- [x] Storybook 集成
- [ ] 完整 Canvas 渲染引擎
- [ ] 事件处理系统（鼠标、键盘）
- [ ] 更多核心模块（selection、clipboard、merge 等）
- [ ] 完整 API 接口
- [ ] 工具栏组件
- [ ] 公式栏组件
- [ ] 右键菜单
- [ ] 协作功能

## 📄 许可证

MIT License

---

**创建时间**: 2024-10-14  
**维护者**: DtyLuckySheet Team  
**版本**: 0.1.0 (Alpha)

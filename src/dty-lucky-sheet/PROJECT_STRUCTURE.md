# DtyLuckySheet 项目结构文档

## 📁 完整目录结构

```
src/dty-lucky-sheet/
├── packages/                          # 三层架构
│   ├── core/                          # 核心逻辑层（纯 TypeScript）
│   │   ├── src/
│   │   │   ├── types.ts              # 核心类型定义
│   │   │   │   ├── Op, Cell, Sheet
│   │   │   │   ├── Selection, Context
│   │   │   │   └── CellMatrix, SheetConfig
│   │   │   ├── context.ts            # 全局状态管理
│   │   │   │   ├── Context 类型定义
│   │   │   │   ├── defaultContext()
│   │   │   │   └── ensureSheetIndex()
│   │   │   ├── settings.ts           # 配置项
│   │   │   │   ├── Settings 类型
│   │   │   │   ├── Hooks 定义
│   │   │   │   └── defaultSettings
│   │   │   ├── modules/              # 功能模块
│   │   │   │   ├── formula.ts        # 公式缓存
│   │   │   │   ├── selection.ts      # 选区管理
│   │   │   │   └── index.ts
│   │   │   ├── utils/                # 工具函数
│   │   │   │   ├── index.ts          # 基础工具
│   │   │   │   └── patch.ts          # Immer patch 处理
│   │   │   └── index.ts              # 统一导出
│   │   └── package.json
│   │
│   ├── react/                         # React 组件层
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Workbook/         # 主容器组件
│   │   │   │   │   ├── index.tsx     # Workbook 实现
│   │   │   │   │   └── index.css     # 样式
│   │   │   │   └── Sheet/            # 工作表组件
│   │   │   │       ├── index.tsx     # Sheet 实现
│   │   │   │       └── index.css     # 样式
│   │   │   ├── context/
│   │   │   │   └── index.tsx         # React Context
│   │   │   └── index.ts              # 统一导出
│   │   └── package.json
│   │
│   └── formula/                       # 公式引擎层
│       ├── src/
│       │   └── index.ts              # 公式解析器封装
│       └── package.json
│
├── stories/                           # Storybook 示例
│   ├── Features.stories.tsx          # 功能演示
│   │   ├── Basic
│   │   ├── Formula
│   │   ├── Empty
│   │   ├── Tabs
│   │   └── MultiInstance
│   ├── API.stories.tsx               # API 演示
│   │   ├── GetCellValue
│   │   └── SetCellValue
│   ├── data/                         # 示例数据
│   │   ├── cell.ts                   # 单元格数据
│   │   ├── formula.ts                # 公式数据
│   │   └── empty.ts                  # 空表格
│   └── utils.ts                      # 工具函数
│
├── index.ts                          # 主入口
├── README.md                         # 项目文档
├── PROJECT_STRUCTURE.md              # 本文件
├── QUICK_START.md                    # 快速开始
└── USAGE_EXAMPLE.tsx                 # 使用示例

旧文件（已删除）：
├── components/DtyLuckySheet.tsx      # ❌ 已删除
├── lib/utils.ts                      # ❌ 已删除
├── stories/DtyLuckySheet.stories.tsx # ❌ 已删除
└── types.ts                          # ❌ 已删除
```

## 📦 包依赖关系

```
@dty-lucky-sheet/react
    ↓ depends on
@dty-lucky-sheet/core
    
@dty-lucky-sheet/formula
    ↓ (独立)
fast-formula-parser
```

## 🔄 数据流

```
用户交互 → Sheet (Canvas/DOM)
           ↓
       Workbook (React Context)
           ↓
       Context (Immer State)
           ↓
       Core Modules (纯逻辑)
           ↓
       onChange 回调
```

## 🎨 核心组件说明

### 1. Core 层

#### types.ts
- **Cell**: 单元格数据结构（值、样式、公式）
- **Sheet**: 工作表数据结构
- **Context**: 全局状态（100+ 属性）
- **Selection**: 选区定义
- **Op**: 操作记录（用于 Undo/Redo 和协作）

#### context.ts
- `defaultContext()`: 创建默认上下文
- `getFlowdata()`: 获取当前工作表数据
- `ensureSheetIndex()`: 确保工作表有唯一 ID
- `initSheetIndex()`: 初始化当前工作表

#### settings.ts
- `Settings`: 配置项类型
- `Hooks`: 生命周期钩子
- `defaultSettings`: 默认配置

#### utils/patch.ts
- `filterPatch()`: 过滤不需要的 patches
- `patchToOp()`: 将 Immer Patch 转换为 Op
- `inverseRowColOptions()`: 反转行列操作选项

### 2. React 层

#### Workbook
- 主容器组件
- 使用 `produceWithPatches` 管理状态
- 实现 Undo/Redo
- 暴露 API（通过 `useImperativeHandle`）
- 管理多个 Sheet

**关键功能**：
```typescript
- setContextWithProduce: 状态更新
- handleUndo/handleRedo: 撤销/重做
- emitOp: 发送操作事件（协作）
- API: getCellValue, setCellValue
```

#### Sheet
- 工作表渲染组件
- Canvas 初始化和绘制
- 简单的网格和数据渲染

#### Context
- React Context 实现
- 提供 `useWorkbook` Hook
- 在组件树中传递状态

### 3. Formula 层

- 封装 `fast-formula-parser`
- 提供 `createFormulaParser()` 工厂函数
- 后续可扩展自定义函数

## 📊 Storybook 结构

### Features Stories
- **Basic**: 展示基本单元格数据
- **Formula**: 展示公式计算
- **Empty**: 空表格
- **Tabs**: 多工作表
- **MultiInstance**: 多个 Workbook 实例

### API Stories
- **GetCellValue**: 演示读取单元格
- **SetCellValue**: 演示设置单元格

每个 API Story 使用 `ApiExecContainer` 包装，提供 "Run" 按钮执行操作。

## 🔧 技术栈

| 技术 | 用途 | 层级 |
|------|------|------|
| TypeScript | 类型安全 | 全部 |
| React | UI 框架 | React 层 |
| Immer | 状态管理 | Core + React |
| lodash | 工具函数 | Core |
| fast-formula-parser | 公式解析 | Formula 层 |
| Canvas API | 渲染 | React 层 |
| Storybook | 组件文档 | Stories |

## 🚀 开发工作流

### 1. 添加新功能

```
1. 在 Core 层添加类型定义 (types.ts)
2. 在 Core 层实现逻辑 (modules/)
3. 在 React 层集成 UI (components/)
4. 创建 Story 示例 (stories/)
5. 更新文档
```

### 2. 调试

```typescript
// 在 Workbook 中启用 logPatch
setContextWithProduce((ctx) => {
  // 修改
}, { logPatch: true });

// 控制台将输出所有 patches
```

### 3. 测试 API

访问 Storybook:
```
npm run storybook
→ http://localhost:6006/?path=/story/dtyluckysheet-api--get-cell-value
```

点击 "Run" 按钮测试 API。

## 📝 状态管理详解

### Immer + Patches

```typescript
const [result, patches, inversePatches] = produceWithPatches(
  state,
  (draft) => {
    draft.luckysheetfile[0].data[0][0].v = "new value";
  }
);

// patches: 记录了如何从旧状态到新状态
// inversePatches: 记录了如何从新状态回到旧状态
// 用于 Undo/Redo
```

### Undo/Redo 实现

```typescript
undoList.push({
  patches,           // 前进操作
  inversePatches,    // 后退操作
  options,           // 元数据
});

// Undo: 应用 inversePatches
// Redo: 应用 patches
```

## 🎯 下一步计划

### 短期（1-2周）
- [ ] 完整 Canvas 渲染（行列标题、单元格样式）
- [ ] 鼠标事件处理（点击、拖拽选择）
- [ ] 键盘事件处理（方向键、快捷键）
- [ ] 单元格编辑功能

### 中期（2-4周）
- [ ] 工具栏组件
- [ ] 公式栏组件
- [ ] 右键菜单
- [ ] 更多 API（合并单元格、插入行列等）
- [ ] 更多 Stories

### 长期（1-2月）
- [ ] 公式计算引擎
- [ ] 格式化系统
- [ ] 协作功能（WebSocket）
- [ ] 性能优化
- [ ] 单元测试

## 📚 参考资料

- FortuneSheet: https://github.com/ruilisi/fortune-sheet
- Immer 文档: https://immerjs.github.io/immer/
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- fast-formula-parser: https://github.com/LesterLyu/fast-formula-parser

---

**最后更新**: 2024-10-14  
**维护者**: DtyLuckySheet Team

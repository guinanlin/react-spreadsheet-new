# 📋 复制 FortuneSheet 代码到 DtyLuckySheet

## 目标

将 FortuneSheet 的核心代码复制到我们的项目中，创建完全独立的 DtyLuckySheet 组件。

## 需要复制的文件

### 1. Core 模块（核心逻辑）

```
fortune-sheet/packages/core/src/
├── canvas.ts              → src/dty-lucky-sheet/core/canvas.ts
├── context.ts             → src/dty-lucky-sheet/core/context.ts
├── types.ts               → src/dty-lucky-sheet/core/types.ts
├── settings.ts            → src/dty-lucky-sheet/core/settings.ts
├── utils/                 → src/dty-lucky-sheet/core/utils/
├── events/                → src/dty-lucky-sheet/core/events/
│   ├── mouse.ts          # 鼠标事件（拖拽选择）
│   ├── keyboard.ts       # 键盘事件
│   └── paste.ts          # 粘贴事件
└── modules/               → src/dty-lucky-sheet/core/modules/
    ├── cell.ts           # 单元格操作
    ├── selection.ts      # 选区管理
    ├── formula.ts        # 公式处理
    └── ...
```

### 2. React 组件

```
fortune-sheet/packages/react/src/components/
├── Sheet/                 → src/dty-lucky-sheet/components/Sheet/
├── SheetOverlay/          → src/dty-lucky-sheet/components/SheetOverlay/
│   ├── InputBox.tsx      # 输入框
│   ├── index.tsx         # 覆盖层
│   └── ...
└── Workbook/              → src/dty-lucky-sheet/components/Workbook/
    └── index.tsx         # 主组件
```

### 3. 样式文件

```
fortune-sheet/packages/react/src/components/
├── Sheet/index.css        → src/dty-lucky-sheet/components/Sheet/index.css
├── SheetOverlay/index.css → src/dty-lucky-sheet/components/SheetOverlay/index.css
└── Workbook/index.css     → src/dty-lucky-sheet/components/Workbook/index.css
```

## 执行步骤

### 步骤 1：创建目录结构

```bash
mkdir -p src/dty-lucky-sheet/core/{events,modules,utils}
mkdir -p src/dty-lucky-sheet/components/{Sheet,SheetOverlay,Workbook}
```

### 步骤 2：复制核心文件

最关键的文件：
1. `canvas.ts` - Canvas 绘制逻辑
2. `context.ts` - Context 定义和初始化
3. `types.ts` - 所有类型定义
4. `events/mouse.ts` - 鼠标事件处理（包含拖拽选择）
5. `events/keyboard.ts` - 键盘事件处理
6. `modules/selection.ts` - 选区管理

### 步骤 3：复制 React 组件

最关键的组件：
1. `Sheet/index.tsx` - 主渲染组件
2. `SheetOverlay/InputBox.tsx` - 输入框组件
3. `SheetOverlay/index.tsx` - 覆盖层容器

### 步骤 4：调整导入路径

将所有的：
```typescript
import { xxx } from '@fortune-sheet/core';
```

改为：
```typescript
import { xxx } from '../../core/xxx';
```

### 步骤 5：简化不需要的功能

可以删除：
- Toolbar（工具栏）
- FxEditor（公式编辑器）
- SheetTab（工作表标签）
- 等等...

## 预估时间

- 复制文件：30 分钟
- 调整导入：30 分钟
- 测试修复：1 小时
- **总计：2 小时**

## 开始实施？

现在开始复制这些文件吗？

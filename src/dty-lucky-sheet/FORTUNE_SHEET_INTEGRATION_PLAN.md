# 🎯 DtyLuckySheet - FortuneSheet 集成方案

## 问题分析

你是对的！我之前的做法太复杂了，在重新发明轮子。FortuneSheet 已经有了非常成熟的实现：
- ✅ 完整的事件处理系统
- ✅ 成熟的选区管理
- ✅ 拖拽选择
- ✅ Canvas 渲染
- ✅ 撤销/重做
- ✅ 复制/粘贴
- ✅ 等等...

**应该直接复用 FortuneSheet 的代码！**

---

## 🚀 新的实现方案

### 方案 A：直接包装 FortuneSheet（推荐）

**最简单最快的方案** - 直接使用 FortuneSheet 的 Workbook 组件

```tsx
// src/dty-lucky-sheet/DtyLuckySheet.tsx
import { Workbook } from '../../fortune-sheet/packages/react/src/components/Workbook';
import '../../fortune-sheet/packages/react/src/components/Workbook/index.css';

export const DtyLuckySheet = Workbook;
export type { WorkbookInstance as DtyLuckySheetInstance } from '../../fortune-sheet/packages/react/src/components/Workbook';
```

**优点**：
- ✅ 5 分钟完成
- ✅ 所有功能开箱即用
- ✅ 零 bug（使用成熟代码）
- ✅ 完整的事件处理
- ✅ 完整的编辑功能

**缺点**：
- ❌ 依赖 FortuneSheet 源码
- ❌ 需要调整导入路径

---

### 方案 B：复制核心文件到项目中

**推荐方案** - 将 FortuneSheet 的核心文件复制到我们的项目

#### 文件结构

```
src/dty-lucky-sheet/
├── core/                    # 从 @fortune-sheet/core 复制
│   ├── canvas.ts
│   ├── context.ts
│   ├── types.ts
│   ├── events/
│   │   ├── mouse.ts        # 鼠标事件（包含拖拽选择）
│   │   ├── keyboard.ts     # 键盘事件
│   │   └── paste.ts        # 粘贴事件
│   └── modules/
│       ├── cell.ts         # 单元格操作
│       ├── selection.ts    # 选区管理
│       └── ...
├── components/
│   ├── DtyLuckySheet.tsx   # 主组件（基于 Workbook）
│   ├── Sheet.tsx           # Sheet 组件（基于 Fortune 的 Sheet）
│   ├── InputBox.tsx        # 输入框（基于 Fortune 的 InputBox）
│   └── SheetOverlay/       # 覆盖层（基于 Fortune 的 SheetOverlay）
└── context/
    └── index.ts            # Context 定义
```

#### 实施步骤

1. **复制核心文件**
   ```bash
   # 复制 core 模块
   cp -r fortune-sheet/packages/core/src/* src/dty-lucky-sheet/core/
   
   # 复制关键组件
   cp fortune-sheet/packages/react/src/components/Sheet/index.tsx src/dty-lucky-sheet/components/Sheet.tsx
   cp fortune-sheet/packages/react/src/components/SheetOverlay/InputBox.tsx src/dty-lucky-sheet/components/InputBox.tsx
   ```

2. **调整导入路径**
   ```typescript
   // 从
   import { Context } from '@fortune-sheet/core';
   
   // 改为
   import { Context } from '../core/context';
   ```

3. **简化不需要的功能**
   - 移除 Toolbar（工具栏）
   - 移除 FxEditor（公式编辑器）
   - 移除 SheetTab（工作表标签）
   - 保留核心的 Sheet 和 SheetOverlay

4. **创建简化的 Workbook**
   ```typescript
   export const DtyLuckySheet = ({ data, onChange }) => {
     const [context, setContext] = useState(defaultContext());
     
     // 使用 FortuneSheet 的核心逻辑
     // 但 UI 更简洁
     
     return (
       <WorkbookContext.Provider value={providerValue}>
         <Sheet sheet={currentSheet} />
         <SheetOverlay />
       </WorkbookContext.Provider>
     );
   };
   ```

**优点**：
- ✅ 完全控制代码
- ✅ 可以自定义和简化
- ✅ 不依赖外部源码
- ✅ 所有功能都是成熟的

**缺点**：
- ⚠️ 需要复制大量文件
- ⚠️ 需要调整导入路径
- ⚠️ 需要 2-3 小时工作

---

### 方案 C：发布 FortuneSheet 的简化版

将 FortuneSheet 作为 npm 包安装，然后包装

```bash
cd fortune-sheet/packages/react
npm link

cd ../../../
npm link @fortune-sheet/react
```

**优点**：
- ✅ 标准的依赖管理
- ✅ 可以升级

**缺点**：
- ❌ 需要构建 FortuneSheet
- ❌ 依赖管理复杂

---

## 💡 我的建议

**立即采用方案 A，快速验证功能**

```tsx
// src/dty-lucky-sheet/DtyLuckySheet.tsx
import React from 'react';
import { Workbook, WorkbookInstance } from '../../fortune-sheet/packages/react/src/components/Workbook';
import '../../fortune-sheet/packages/react/src/components/Workbook/index.css';
import '../../fortune-sheet/packages/react/src/components/Sheet/index.css';
import type { Sheet, Settings } from '../../fortune-sheet/packages/core/src/types';

export type DtyLuckySheetProps = {
  data: Sheet[];
  onChange?: (data: Sheet[]) => void;
  allowEdit?: boolean;
} & Partial<Settings>;

export type { WorkbookInstance as DtyLuckySheetInstance };

export const DtyLuckySheet = React.forwardRef<WorkbookInstance, DtyLuckySheetProps>(
  (props, ref) => {
    return (
      <Workbook
        ref={ref}
        {...props}
        showToolbar={false}
        showFormulaBar={false}
        showSheetTabs={false}
      />
    );
  }
);

DtyLuckySheet.displayName = 'DtyLuckySheet';
```

**这样你就能在 5 分钟内获得：**
- ✅ 完整的拖拽选择
- ✅ 完整的键盘导航
- ✅ 完整的编辑功能
- ✅ 复制粘贴
- ✅ 撤销重做
- ✅ 所有 FortuneSheet 的功能

**然后可以逐步：**
1. 测试所有功能
2. 确认满足需求
3. 再决定是否需要自定义

---

## 🎯 立即行动

让我现在就实现方案 A，给你一个完全可用的版本！

你想要：
- [ ] **方案 A** - 立即可用（5 分钟）
- [ ] **方案 B** - 完全控制（2-3 小时）
- [ ] **方案 C** - npm 包（需要构建）

我建议先用方案 A 快速验证，然后再考虑是否需要 B！

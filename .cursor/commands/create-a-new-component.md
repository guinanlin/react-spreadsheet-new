# DtyInput 组件库 - 新组件创建 SOP

> 标准操作流程（Standard Operating Procedure）

## 📋 目录结构说明

```
src/dtyinput/
├── components/              # ✅ 组件实现（必需）
│   ├── DtyInput.tsx
│   └── DropdownSuggestions.tsx
├── hooks/                   # ✅ 自定义 Hooks（按需）
│   └── use-debounce.ts
├── lib/                     # ✅ 工具函数（通用）
│   └── utils.ts            # cn 函数用于合并 className
├── stories/                 # ✅ Storybook 示例（强烈推荐）
│   ├── DtyInput.stories.tsx
│   └── ...
├── index.ts                 # ✅ 统一导出入口（必需）
├── types.ts                 # ✅ TypeScript 类型定义（必需）
├── README.md                # ✅ 组件文档（必需）
└── USAGE_EXAMPLE.tsx        # ✅ 使用示例（推荐）
```

**注意**：~~`styles/globals.css`~~ **不是组件库的一部分**，样式应使用项目全局的 Tailwind CSS 配置。

---

## 🎯 创建新组件 - 标准流程

### **第 1 步：定义 TypeScript 类型**

📁 编辑文件：`src/dtyinput/types.ts`

```typescript
/**
 * 新组件的 Props 接口
 */
export interface NewComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  // 基础属性
  value?: string;
  onChange?: (value: string) => void;
  
  // 可选配置
  width?: string | number;
  disabled?: boolean;
  placeholder?: string;
  
  // 回调函数
  onCustomEvent?: (data: any) => void;
  
  // 调试模式
  debug?: boolean;
}
```

**关键点**：
- ✅ 继承 React 原生 Props（如 `HTMLAttributes`）
- ✅ 使用可选属性（`?`）提高灵活性
- ✅ 添加 JSDoc 注释说明用途

---

### **第 2 步：创建组件文件**

📁 创建文件：`src/dtyinput/components/NewComponent.tsx`

```typescript
"use client" // 如果需要客户端渲染（使用 useState, useEffect 等）

import React, { useState } from 'react'
import { cn } from "../lib/utils" // 用于合并 className
import type { NewComponentProps } from "../types"

/**
 * NewComponent - 新组件说明
 * 
 * @example
 * ```tsx
 * <NewComponent value="test" onChange={(v) => console.log(v)} />
 * ```
 */
export function NewComponent({ 
  value,
  onChange,
  width = 300,
  disabled = false,
  className,
  debug = false,
  ...props 
}: NewComponentProps) {
  const [internalValue, setInternalValue] = useState(value || '');

  // 调试日志
  if (debug) {
    console.log('[NewComponent] render:', { value, disabled });
  }

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div 
      className={cn(
        // 基础样式
        "flex items-center gap-2 p-2 border rounded-md",
        // 状态样式
        disabled && "opacity-50 cursor-not-allowed",
        // 自定义样式
        className
      )}
      style={{ width }}
      {...props}
    >
      {/* 组件内容 */}
      <input
        type="text"
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        className="flex-1 outline-none bg-transparent"
      />
    </div>
  );
}
```

**关键点**：
- ✅ 使用 `cn()` 合并 className（支持条件样式）
- ✅ 解构 props 并提供默认值
- ✅ 使用 `...props` 传递额外属性
- ✅ 添加 JSDoc 注释和示例

---

### **第 3 步：统一导出**

📁 编辑文件：`src/dtyinput/index.ts`

```typescript
// 导出主组件
export { DtyInput } from './components/DtyInput';
export { DropdownSuggestions } from './components/DropdownSuggestions';
export { NewComponent } from './components/NewComponent'; // ⬅️ 新增

// 导出 hooks
export { useDebounce } from './hooks/use-debounce';

// 导出工具函数
export { cn } from './lib/utils';

// 导出类型
export type {
  DtyInputProps,
  SuggestionItem,
  CustomChangeEvent,
  DropdownSuggestionsProps,
  NewComponentProps, // ⬅️ 新增
} from './types';
```

**关键点**：
- ✅ 组件和类型都必须导出
- ✅ 保持导出顺序一致性（组件 → Hooks → 工具 → 类型）

---

### **第 4 步：创建 Storybook 故事**

📁 创建文件：`src/dtyinput/stories/NewComponent.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { NewComponent } from '../components/NewComponent';

const meta: Meta<typeof NewComponent> = {
  title: 'DtyInput/NewComponent',
  component: NewComponent,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'number' },
    disabled: { control: 'boolean' },
    debug: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof NewComponent>;

// 默认示例
export const Default: Story = {
  args: {
    value: 'Hello World',
    placeholder: '请输入内容',
  },
};

// 禁用状态
export const Disabled: Story = {
  args: {
    value: 'Disabled',
    disabled: true,
  },
};

// 自定义宽度
export const CustomWidth: Story = {
  args: {
    width: 500,
    value: 'Custom Width',
  },
};

// 调试模式
export const DebugMode: Story = {
  args: {
    debug: true,
    value: 'Debug Mode',
  },
};
```

**关键点**：
- ✅ 使用 `Meta` 和 `StoryObj` 类型
- ✅ 创建多个 Story 展示不同场景
- ✅ 使用 `argTypes` 配置可交互控件

---

### **第 5 步：更新 README 文档**

📁 编辑文件：`src/dtyinput/README.md`

在适当位置添加新组件的说明：

```markdown
## NewComponent 组件

简短描述组件的功能和用途。

### 基本用法

\`\`\`tsx
import { NewComponent } from '@/dtyinput';

function MyComponent() {
  return (
    <NewComponent 
      value="Hello" 
      onChange={(v) => console.log(v)} 
    />
  );
}
\`\`\`

### API

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| value | `string` | - | 组件值 |
| onChange | `(value: string) => void` | - | 值变化回调 |
| width | `string \| number` | `300` | 组件宽度 |
| disabled | `boolean` | `false` | 是否禁用 |
| debug | `boolean` | `false` | 调试模式 |
```

---

### **第 6 步（可选）：创建自定义 Hook**

如果组件逻辑复杂，可以抽取成 Hook：

📁 创建文件：`src/dtyinput/hooks/use-new-feature.ts`

```typescript
import { useState, useEffect } from "react"

/**
 * 自定义 Hook 说明
 * @param initialValue - 初始值
 * @returns Hook 返回值
 */
export function useNewFeature(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(value.length > 0);
  }, [value]);

  return { value, setValue, isValid };
}
```

然后在 `index.ts` 中导出：

```typescript
export { useNewFeature } from './hooks/use-new-feature';
```

---

## ✅ 完成检查清单

创建新组件后，请确认以下事项：

- [ ] **类型定义**：在 `types.ts` 中定义了 Props 接口
- [ ] **组件实现**：在 `components/` 中创建了组件文件
- [ ] **统一导出**：在 `index.ts` 中导出了组件和类型
- [ ] **Storybook 示例**：创建了至少 2-3 个 Story
- [ ] **文档更新**：在 `README.md` 中添加了使用说明
- [ ] **类型检查**：运行 `npm run type-check` 无错误
- [ ] **本地测试**：通过 `npm run storybook` 测试组件
- [ ] **代码审查**：确保代码符合项目规范

---

## 🎨 样式规范

### **使用 Tailwind CSS**

```typescript
// ✅ 推荐：使用 Tailwind 类名
className="flex items-center gap-2 p-2 border rounded-md"

// ✅ 推荐：使用 cn() 函数处理条件样式
className={cn(
  "base-class",
  isActive && "active-class",
  disabled && "disabled-class",
  className // 允许外部覆盖
)}

// ❌ 避免：内联样式（除非必需，如动态宽度）
style={{ width: dynamicWidth }}
```

### **响应式设计**

```typescript
className="w-full sm:w-auto md:w-64 lg:w-80"
```

### **主题变量**

```typescript
// 使用 Tailwind 主题颜色（定义在项目全局配置中）
className="bg-background text-foreground border-border"
```

---

## 🚀 高级场景

### **Portal 渲染（浮层组件）**

如果是下拉框、弹窗等需要脱离 DOM 层级的组件：

```typescript
import { createPortal } from "react-dom"

export function PopoverComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!isOpen) return null;
  
  const content = (
    <div className="fixed inset-0 z-50">
      {/* 浮层内容 */}
    </div>
  );
  
  return createPortal(content, document.body);
}
```

### **ForwardRef 转发**

如果需要暴露 DOM 引用：

```typescript
import { forwardRef } from 'react'

export const NewComponent = forwardRef<HTMLDivElement, NewComponentProps>(
  ({ value, ...props }, ref) => {
    return <div ref={ref} {...props}>{value}</div>
  }
);

NewComponent.displayName = 'NewComponent';
```

---

## 📦 最佳实践

1. **类型优先**：先定义类型，再实现组件
2. **解耦逻辑**：复杂逻辑抽取成 Hook
3. **可组合性**：组件应该易于组合和扩展
4. **受控/非受控**：支持两种模式提高灵活性
5. **键盘导航**：添加 `onKeyDown` 等事件处理
6. **无障碍性**：添加 ARIA 属性（`aria-label`, `role` 等）
7. **调试模式**：通过 `debug` prop 输出调试信息
8. **性能优化**：使用 `React.memo`, `useMemo`, `useCallback`

---

## 📚 参考资源

- [shadcn/ui 组件](https://ui.shadcn.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Storybook 文档](https://storybook.js.org/docs)
- [React TypeScript 最佳实践](https://react-typescript-cheatsheet.netlify.app/)

---

## 🔍 示例：完整的简单组件

最后，这里是一个完整的最小示例：

```typescript
// types.ts
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

// components/Badge.tsx
import { cn } from "../lib/utils"
import type { BadgeProps } from "../types"

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variant === 'default' && "bg-gray-100 text-gray-800",
        variant === 'success' && "bg-green-100 text-green-800",
        variant === 'warning' && "bg-yellow-100 text-yellow-800",
        variant === 'error' && "bg-red-100 text-red-800",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// index.ts
export { Badge } from './components/Badge';
export type { BadgeProps } from './types';
```

---

**更新时间**：2024-10-12  
**维护者**：DtyInput Team


# shadcn/ui 组件

这个目录包含从 [shadcn/ui](https://ui.shadcn.com) 手动创建的 UI 组件。

## 关于 shadcn/ui

shadcn/ui 不是一个组件库，而是一组可复用的组件，你可以将其复制到你的应用中。它基于：
- **Radix UI** - 无样式、可访问的组件基础
- **Tailwind CSS** - 用于样式
- **CSS Variables** - 用于主题定制

## 当前组件

### Input 组件

位置: `src/components/ui/input.tsx`

这是 shadcn 的标准 Input 组件，提供：
- 一致的样式
- 无障碍支持
- TypeScript 类型
- 支持所有原生 input 属性

**使用方法:**

```tsx
import { Input } from "@/components/ui/input"

function MyComponent() {
  return <Input type="email" placeholder="Email" />
}
```

**Props:**

Input 组件接受所有标准的 HTML input 属性，包括：
- `type` - 输入类型（text, email, password 等）
- `placeholder` - 占位符文本
- `disabled` - 是否禁用
- `className` - 自定义样式类
- ...所有其他原生 input 属性

## 为什么手动创建？

由于这个项目的特殊结构（不是标准的 Next.js 或 Vite 项目），shadcn CLI 无法自动检测框架。因此我们手动创建了组件文件，这是 shadcn 推荐的做法之一。

## 添加更多组件

如果需要添加更多 shadcn 组件，可以：

1. **访问 shadcn/ui 文档**: https://ui.shadcn.com/docs/components
2. **选择组件**: 找到你需要的组件
3. **复制源代码**: 将组件代码复制到 `src/components/ui/` 目录
4. **调整导入路径**: 确保 `cn` 函数的导入路径正确

**示例 - 添加 Button 组件:**

访问 https://ui.shadcn.com/docs/components/button，复制源代码到 `src/components/ui/button.tsx`，然后调整导入：

```tsx
import { cn } from "@/dtyinput/lib/utils"
```

## 主题定制

shadcn 组件使用 CSS 变量进行主题定制。这些变量在 `src/dtyinput/styles/globals.css` 中定义：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  /* ...更多变量 */
}
```

修改这些变量即可更改整个应用的主题。

## 相关资源

- [shadcn/ui 官方文档](https://ui.shadcn.com)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [Radix UI 文档](https://www.radix-ui.com)

